import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entity/User";
import {
  createAccessToken,
  createRefreshToken
} from "../services/auth/web/createTokens";
import { getConnection } from "typeorm";
import { transporter } from "../services/mailer/transporter";
import { redis } from "../services/redis";
import { verificationEmail } from "../services/mailer/verificationEmail";
import { rateLimit } from "../services/rate-limit";
import { MyContext } from '../services/context';
import { sendRefreshToken } from '../services/auth/sendRefreshToken';
import { isAuth } from '../services/auth/isAuth';
import { createOAuth2Client, verifyIdToken } from '../services/auth/google';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() { payload }: MyContext) {
    try {
      const user = await User.findOne({ id: parseInt(payload!.userId) });
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Query(() => String)
  async login_googleOAuth() {
    const client = await createOAuth2Client();

    const scopes = ["openid", "email"];

    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    return url;
  }

  @Mutation(() => String)
  @UseMiddleware(rateLimit(10))
  async sendVerificationLink(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const user = await User.findOne({ email })
      if (user) {
        throw new Error("This email is already in use")
      }
      const verificationLink = await hash(email, 10);
      const hashedPassword = await hash(password, 12);

      await redis.hmset(email, { password: hashedPassword, verificationLink })
      redis.expire(email, 3600)

      transporter.sendMail(verificationEmail(email, verificationLink));
      return verificationLink;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => String)
  @UseMiddleware(rateLimit(10))
  async resendVerificationLink(
    @Arg("email") email: string
  ) {
    try {
      const user = await User.findOne({ email })
      if (user) throw new Error('This account has already been verified')
      const { password, verificationLink } = await redis.hgetall(email)
      if (!password || !verificationLink) throw new Error('This email is no longer valid, sign up again')
      const newVerificationLink = await hash(verificationLink, 10)

      await redis.hmset(email, { password, verificationLink: newVerificationLink })
      redis.expire(email, 3600)

      transporter.sendMail(verificationEmail(email, newVerificationLink))
      return newVerificationLink
    } catch (err) {
      console.log(err)
      return err
    }
  }

  @Mutation(() => LoginResponse)
  @UseMiddleware(rateLimit(10))
  async register(
    @Arg("email") email: string,
    @Arg("verificationLink") verificationLink: string,
    @Ctx() { res }: MyContext
  ) {
    try {
      const { verificationLink: storedLink, password } = await redis.hgetall(email)
      if (verificationLink !== storedLink) {
        throw new Error('This link has expired')
      }

      const user = await User.create({
        email,
        password,
        auth: 'website'
      }).save();
      await redis.del(email)
      
      sendRefreshToken(res, createRefreshToken(user))

      return {
        accessToken: createAccessToken(user),
        user
      };
    } catch (err) {
      console.log(err)
      return err
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Could not find user");
      }

      // if user's password from db is NULL
      if (!user.password) {
        throw new Error(
          `This account doesn't have a password set. Do you normally login with google?`
        );
      }

      const valid = await compare(password, user.password);

      if (!valid) {
        throw new Error("Incorrect password");
      }

      // login succesful

      // send refreshToken thru cookie
      sendRefreshToken(res, createRefreshToken(user));

      // send accessToken to client
      return {
        accessToken: createAccessToken(user),
        user
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    // send empty string for refreshtoken
    sendRefreshToken(res, "");
    return true;
  }

  @Mutation(() => LoginResponse)
  //TODO: Better mutation naming
  async auth_googleOAuth(@Arg("code") code: string, @Ctx() { res }: MyContext) {
    try {
      const client = await createOAuth2Client();

      if (!client) {
        throw new Error("Failed to create OAuth2 client");
      }
      const { tokens } = await client.getToken(decodeURIComponent(code));
      client.setCredentials(tokens);

      if (!tokens) {
        throw new Error("Invalid code for tokens");
      }
      const payload = await verifyIdToken(tokens.id_token!);

      if (!payload) {
        throw new Error("Failed to retrieve payload");
      }
      let user = await User.findOne({ email: payload.email });

      if (!user) {
        // register user to db if they don't exist in system
        user = await User.create({
          email: payload.email,
          auth: 'google'
        }).save();

        if (!user) {
          throw new Error("Failed to create user");
        }
      }

      console.log('tokens is ', tokens);

      if (!tokens.refresh_token) {
        // if no refresh_token, retrieve refreshtoken via api request
        // tokens.refresh_token = await

        throw new Error('Failed to retrieve refresh_token from google');
      }

      sendRefreshToken(res, createRefreshToken(tokens.refresh_token!));

      return {
        accessToken: createAccessToken(tokens.id_token!),
        user
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    return true;
  }
}
