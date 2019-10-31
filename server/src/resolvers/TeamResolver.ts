import { createBaseResolver } from "./BaseResolver";

import { Team } from "../entity/Team";
import {
  Resolver,
  Arg,
  UseMiddleware,
  Ctx,
  Mutation,
  Int,
  Query
} from "type-graphql";
import { isAuth } from "../services/auth/isAuth";
import { v4 } from "uuid";
import { MyContext } from "../services/context";
import { User } from "../entity/User";
import { redis } from "../services/redis";
import { transporter } from "../services/emails/transporter";
import { teamInviteEmail } from "../services/emails/teamInvite";
import { rateLimit } from "../services/rate-limit";

const TeamBaseResolver = createBaseResolver("Team", Team);

@Resolver()
export class TeamResolver extends TeamBaseResolver {
  @Query(() => [Team])
  @UseMiddleware(isAuth)
  async getUserTeams(@Ctx() { payload }: MyContext) {
    try {
      const user = await User.findOne({
        relations: ["teams"],
        where: { id: payload!.userId }
      });
      if (!user) throw new Error(`This user doesn't exist`);
      return user.teams;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => Team)
  @UseMiddleware(isAuth)
  async createTeam(@Arg("name") name: string, @Ctx() { payload }: MyContext) {
    try {
      const user = await User.findOne({ where: { id: payload!.userId } });
      const team = await Team.create({
        name
      });
      team.members = [user!];
      return await team.save();
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth, rateLimit(30))
  async sendTeamInviteLink(
    @Arg("teamId", () => Int) teamId: number,
    @Arg("email") email: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const me = await User.findOne({ where: { id: payload!.userId } });
      const team = await Team.findOne({ where: { id: teamId } });
      if (!team) throw new Error(`This team doesn't exist`);

      const teamInviteLink = v4();
      await redis.hmset(`team-invite-${email}`, { id: teamId, teamInviteLink });
      await redis.expire(`team-invite-${email}`, 3600);
      transporter.sendMail(
        teamInviteEmail({
          sender: me!.username,
          email,
          teamName: team.name,
          teamInviteLink
        })
      );
      return teamInviteLink;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => Boolean)
  async acceptTeamInviteLink(
    @Arg("email") email: string,
    @Arg("teamInviteLink") teamInviteLink: string
  ) {
    try {
      const { teamInviteLink: storedLink, teamId } = await redis.hgetall(
        `team-invite-${email}`
      );
      if (storedLink !== teamInviteLink) {
        throw new Error("This link has expired");
      }

      const user = await User.findOne({ email });
      if (!user) throw new Error(`This user doesn't exist`);
      const team = await Team.findOne({ where: { id: teamId } });
      if (!team) throw new Error(`This team doesn't exist`);
      team.members = [...team.members, user];
      await team.save();
      await redis.del(`team-invite-${email}`);
      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteTeamMember(
    @Arg("teamId", () => Int) teamId: number,
    @Arg("userId", () => Int) userId: number
  ) {
    try {
      const team = await Team.findOne({ where: { id: teamId } });
      if (!team) throw new Error(`This team doesn't exist`);
      const user = await User.findOne({ where: { id: userId } });
      if (!user) throw new Error(`This user doesn't exist`);
      team.members = team.members.filter(member => member.id !== user.id);
      await team.save();

      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Mutation(() => Team)
  @UseMiddleware(isAuth)
  async updateTeam(
    @Arg("teamId", () => Int) teamId: number,
    @Arg("name") name: string
  ) {
    try {
      const team = await Team.findOne({ where: { id: teamId } });
      if (!team) throw new Error(`This team doesn't exist`);
      team.name = name;
      return await team.save();
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
