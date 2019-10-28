import { Mutation, Resolver, Arg, UseMiddleware, Ctx } from 'type-graphql';
import { isAuth } from '../services/auth/isAuth';
import { Project } from '../entity/Project';
import { MyContext } from '../services/context';
import { User } from '../entity/User';

@Resolver()
export class ProjectResolver {
  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async createProject(
    @Arg('name') name: string,
    @Arg('desc') desc: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const user = await User.findOne({ where: { id: payload!.userId } });
      const project = await Project.create({
        name,
        desc,
        owner: user
      });
      // project.members = [user!];
      return await project.save();
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
