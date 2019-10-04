import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../entity/User';
import {
  createAccessToken,
  createRefreshToken
} from '../services/auth/createTokens';
import { Context } from '../services/Context';
import { sendRefreshToken } from '../services/auth/sendRefreshToken';

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

  @Query(() => String)
  bye() {
    return `BYE!!`;
  }

  //FIX
  @Query(() => User)
  async me() {
    const user = await User.find();
    return user[0];
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
    @Ctx() { res }: Context
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
