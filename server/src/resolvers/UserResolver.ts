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
import { MyContext } from '../services/context';
import { sendRefreshToken } from '../services/auth/sendRefreshToken';
import { isAuth } from '../services/auth/isAuth';
import { createOAuth2Client } from '../services/google_oauth';
import { verify } from '../services/google_oauth';
import { getConnection } from 'typeorm';
import { transporter, fromEmail } from '../services/mailer/transporter';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    return await User.find();
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() { payload }: MyContext) {
    try {
      return await User.findOne(payload!.userId);
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
      scope: scopes
    });

    return url;
  }

  @Mutation(() => User)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      const user = await User.create({
        email,
        password: hashedPassword
      }).save();

      return user;
    } catch (err) {
      if (err.code === '23505') {
        throw new Error('This email is already in use');
      }
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
        throw new Error('Could not find user');
      }

      if (!user.validated) {
        throw new Error('This account has not been validated')
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

      if (!tokens) {
        throw new Error('Invalid code for tokens');
      }
      const payload = await verify(tokens.id_token!);

      if (!payload) {
        throw new Error('Failed to retrieve payload');
      }
      let user = await User.findOne({ email: payload.email });

      if (!user) {
        // register user to db if they don't exist in system
        user = await User.create({ email: payload.email }).save();

        if (!user) {
          throw new Error('Failed to create user');
        }
      }

      sendRefreshToken(res, createRefreshToken(user));

      return {
        accessToken: createAccessToken(user),
        user
      };
    } catch (err) {
      console.log('err', err);
      return err;
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(
    @Arg('userId', () => Int) userId: number
  ) {
    await getConnection().getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1)
    return true
  }

  @Mutation(() => Boolean)
  async hello(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedURL = await hash(`${email}${password}`, 12)
    transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Please confirm your account registration',
      html: `
        <p>Click the following link to confirm your account:</p>
        <a href='${process.env.CLIENT_URL}/email-verification/${hashedURL}'></a>
      `
    })

    return true
  }
}
