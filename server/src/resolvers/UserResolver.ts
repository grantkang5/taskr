import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../entity/User';
import {
  createAccessToken,
  createRefreshToken
} from '../services/auth/createTokens';
import { MyContext } from '../services/Context';
import { sendRefreshToken } from '../services/auth/sendRefreshToken';
import { isAuth } from '../services/auth/isAuth';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return `Hello!`;
  }

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
      return await User.findOne(payload!.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
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
}
