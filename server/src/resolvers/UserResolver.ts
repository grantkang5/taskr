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
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../entity/User';
import {
  createAccessToken,
  createRefreshToken
} from '../services/auth/createTokens';
import { getConnection } from 'typeorm';
import { transporter } from '../services/mailer/transporter';
import { verificationEmail } from '../services/mailer/verificationEmail';
import { rateLimit } from '../services/rate-limit';
import { MyContext } from '../services/context';
import { sendRefreshToken } from '../services/auth/sendRefreshToken';
import { isAuth } from '../services/auth/isAuth';
import { createOAuth2Client, verifyIdToken } from '../services/auth/google';
import { cloudinary } from "../services/cloudinary";
import { redis } from '../services/redis';
import { ImageResponse } from './ImageResponse';
import { v4 } from 'uuid'
import { forgotPasswordEmail } from '../services/mailer/forgotPasswordEmail';

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

    const scopes = ['openid', 'email'];

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
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    try {
      const user = await User.findOne({ email })
      if (user) {
        throw new Error('This email is already in use');
      }
      const unverifiedUser = await redis.hgetall(email)
      if (Object.keys(unverifiedUser).length) {
        this.resendVerificationLink(email)
        throw new Error('This account has not been validated. Please check your email for the validation link')
      }

      const verificationLink = v4();
      const hashedPassword = await hash(password, 12);

      await redis.hmset(email, { password: hashedPassword, verificationLink });
      await redis.expire(email, 3600);

      transporter.sendMail(verificationEmail(email, verificationLink));
      return verificationLink;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => String)
  @UseMiddleware(rateLimit(10))
  async resendVerificationLink(@Arg('email') email: string) {
    try {
      const user = await User.findOne({ email });
      if (user) throw new Error('This account has already been verified');
      const { password, verificationLink } = await redis.hgetall(email);
      if (!password || !verificationLink) {
        throw new Error('This email is no longer valid, sign up again');
      }
      const newVerificationLink = v4();

      await redis.hmset(email, {
        password,
        verificationLink: newVerificationLink
      });
      await redis.expire(email, 3600);

      transporter.sendMail(verificationEmail(email, newVerificationLink));
      return newVerificationLink;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => LoginResponse)
  @UseMiddleware(rateLimit(10))
  async register(
    @Arg('email') email: string,
    @Arg('verificationLink') verificationLink: string,
    @Ctx() { res }: MyContext
  ) {
    try {
      const { verificationLink: storedLink, password } = await redis.hgetall(
        email
      );
      if (verificationLink !== storedLink) {
        throw new Error('This link has expired');
      }

      const username = email.split('@')[0];

      const user = await User.create({
        email,
        password,
        username,
        auth: 'website'
      }).save();
      await redis.del(email);

      sendRefreshToken(res, createRefreshToken(user));

      return {
        accessToken: createAccessToken(user),
        user
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Incorrect email address');
      }

      // if user's password from db is NULL
      if (!user.password) {
        throw new Error(
          `This account doesn't have a password set. Do you normally login with google?`
        );
      }

      const valid = await compare(password, user.password);

      if (!valid) {
        throw new Error('Incorrect password');
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
    sendRefreshToken(res, '');
    return true;
  }

  @Mutation(() => LoginResponse)
  //TODO: Better mutation naming
  async auth_googleOAuth(@Arg('code') code: string, @Ctx() { res }: MyContext) {
    try {
      const client = await createOAuth2Client();

      if (!client) {
        throw new Error('Failed to create OAuth2 client');
      }
      const { tokens } = await client.getToken(decodeURIComponent(code));
      client.setCredentials(tokens);

      if (!tokens) {
        throw new Error('Invalid code for tokens');
      }
      const payload = await verifyIdToken(tokens.id_token!);

      if (!payload) {
        throw new Error('Failed to retrieve payload');
      }
      let user = await User.findOne({ email: payload.email });

      if (!user) {
        // register user to db if they don't exist in system
        const username = payload.email!.split('@')[0];
        user = await User.create({
          email: payload.email,
          username,
          auth: 'google'
        }).save();

        if (!user) {
          throw new Error('Failed to create user');
        }
      }

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

  @Mutation(() => ImageResponse)
  @UseMiddleware(isAuth)
  async createAvatar(
    @Arg('image') image: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const user = await User.findOne({ id: parseInt(payload!.userId) })
      const res = await cloudinary.uploader.upload(image)
      user!.avatar = res.public_id
      await user!.save();
      return res
    } catch (err) {
      console.log(err)
      return err
    }
  }

  @Mutation(() => ImageResponse)
  @UseMiddleware(isAuth)
  async updateAvatar(
    @Arg('image') image: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const user = await User.findOne({ id: parseInt(payload!.userId) })
      // destroy current user's avatar from storage
      await cloudinary.uploader.destroy(user!.avatar)

      const res = await cloudinary.uploader.upload(image)
      user!.avatar = res.public_id
      await user!.save();
      return res
    } catch (err) {
      console.log(err)
      return err
    }
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateUsername(
    @Arg('username') username: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const user = await User.findOne({ id: parseInt(payload!.userId) })
      user!.username = username;
      const newUser = await user!.save();
      return newUser
    } catch (err) {
      console.log(err)
      return err;
    }
  }

  @Mutation(() => String)
  @UseMiddleware(rateLimit(5))
  async sendForgotPasswordLink(
    @Arg('email') email: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      if (payload) {
        throw new Error("What are you trying to do?")
      }
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error("This user email does not exist")
      }

      user.tokenVersion++;
      await user.save();

      const forgotPasswordLink = v4();
      await redis.set(`forgot-${email}`, forgotPasswordLink, 'EX', 3600)
      transporter.sendMail(forgotPasswordEmail(email, forgotPasswordLink))
      return forgotPasswordLink
    } catch (err) {
      console.log(err)
      return err;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(rateLimit(5))
  async forgotPassword(
    @Arg('email') email: string,
    @Arg('forgotPasswordLink') forgotPasswordLink: string,
    @Arg('password') password: string,
  ) {
    try {
      const storedLink = await redis.get(`forgot-${email}`)
      if (storedLink !== forgotPasswordLink) {
        throw new Error('This link has expired')
      }
      const user = await User.findOne({ email })
      if (!user) throw new Error("This user doesn't exist")
      const hashedPassword = await hash(password, 12);
      user.password = hashedPassword
      await user.save();
      await redis.del(`forgot-${email}`)
      return true
    } catch (err) {
      console.log(err)
      return err;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth, rateLimit(10))
  async changePassword(
    @Arg('currentPassword') currentPassword: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const user = await User.findOne({ id: parseInt(payload!.userId) })
      if (!user) throw new Error('User not found')
      // if user's password from db is NULL
      if (!user.password) {
        throw new Error(
          `This account doesn't have a password set. Do you normally login with google?`
        );
      }

      const valid = await compare(currentPassword, user.password);
      if (!valid) {
        throw new Error('Incorrect password');
      }
      const hashedPassword = await hash(newPassword, 12);
      user.password = hashedPassword
      await user.save();
      return true;
    } catch (err) {
      console.log(err)
      return err;
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg('userId', () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);
    return true;
  }
}
