import { Mutation, Resolver, Arg, UseMiddleware, Ctx, Int } from 'type-graphql';
import { isAuth } from '../services/auth/isAuth';
import { Project } from '../entity/Project';
import { MyContext } from '../services/context';
import { User } from '../entity/User';
import { rateLimit } from '../services/rate-limit';
import { createBaseResolver } from './BaseResolver';
import { v4 } from 'uuid';

const ProjectBaseResolver = createBaseResolver('Project', Project);

@Resolver()
export class ProjectResolver extends ProjectBaseResolver {
  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async createProject(
    @Ctx() { payload }: MyContext,
    @Arg('name') name: string,
    @Arg('desc', { nullable: true }) desc?: string
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateProject(
    @Arg('id', () => Int) id: number,
    @Arg('name', { nullable: true }) name?: string,
    @Arg('desc', { nullable: true }) desc?: string
  ) {
    try {
      const project = await Project.findOne({ where: { id } });
      if (!project) {
        throw new Error('Project does not exist');
      }
      if (name && project.name !== name) {
        project.name = name;
      }

      if (desc && project.desc !== desc) {
        project.desc = desc;
      }

      await project.save();
      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth, rateLimit(10))
  async sendInvitationLink(
      @Arg('id', () => Int) id: number,
      @Arg('email') email: string,
      @Ctx() { payload }: MyContext,
  ) {
      try {
          const project = await Project.findOne({ where: { id } });
          if (!project) throw new Error('Project does not exist');
          const inviter = await User.findOne({ where: { id: payload!.userId } });
          const user = await User.findOne( {email} );
          if (!user) throw new Error('This user does not exist')

          const invitationLink = v4();
      }
  }
}
