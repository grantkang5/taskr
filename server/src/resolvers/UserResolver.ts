import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Subscription,
  PubSub,
  PubSubEngine,
  Root
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../entity/User';
import {
  createAccessToken,
  createRefreshToken
} from '../services/auth/web/createTokens';
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
  @Query(() => [User])
  async users() {
    return await User.find();
  }

  // Protected route
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `Your user id is:  ${payload!.userId}`;
  }

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
        password: hashedPassword,
        auth: 'website'
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
        user = await User.create({
          email: payload.email,
          auth: 'google'
        }).save();

        if (!user) {
          throw new Error('Failed to create user');
        }
      }

      console.log('tokens is ', tokens);

      if (!tokens.refresh_token) {
        throw new Error('Failed to retrieve refresh_token from google');
      }

      sendRefreshToken(res, createRefreshToken(tokens.refresh_token));

      return {
        accessToken: createAccessToken(tokens.id_token!),
        user
      };
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => String)
  async hello(@PubSub() pubSub: PubSubEngine) {
    await pubSub.publish('HELLO', 'WORLD');
    return `Hello!`;
  }

  @Subscription(() => String, { topics: 'HELLO' })
  helloSubscription(@Root() string: String) {
    return `Subscription string: ${string}`;
  }
}
