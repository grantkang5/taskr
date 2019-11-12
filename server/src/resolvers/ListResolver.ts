import { createBaseResolver } from './BaseResolver';
import {
  Resolver,
  Mutation,
  UseMiddleware,
  Arg,
  ID,
  PubSubEngine,
  PubSub,
  Subscription,
  Root
} from 'type-graphql';
import { List } from '../entity/List';
import { isAuth } from '../services/auth/isAuth';
import { Project } from '../entity/Project';

const ListBaseResolver = createBaseResolver('List', List);
const buffer = 16384;

@Resolver()
export class ListResolver extends ListBaseResolver {
  @Mutation(() => List)
  @UseMiddleware(isAuth)
  async createList(
    @Arg('projectId', () => ID) projectId: number,
    @Arg('name') name: string,
    @PubSub() pubSub: PubSubEngine
  ) {
    try {
      const project = await Project.findOne({ where: { id: projectId } });

      if (!project) {
        throw new Error('Project does not exist');
      }

      const list = await List.create({
        name,
        project
      }).save();
      await pubSub.publish('LISTS', list);
      return list;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Subscription({ topics: 'LISTS' })
  listAdded(@Root() list: List): List {
    return list;
  }

  // update name
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateListName(
    @Arg('id', () => ID) id: number,
    @Arg('name') name: string
  ) {
    try {
      const list = await List.findOne({ where: { id } });
      if (!list) {
        throw new Error('List does not exist');
      }
      list.name = name;
      await list.save();
      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  // update position
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateListPos(
    @Arg('id', () => ID) id: string,
    @Arg('aboveId', () => ID, { nullable: true }) aboveId?: string,
    @Arg('belowId', () => ID, { nullable: true }) belowId?: string
  ) {
    try {
      if (aboveId === undefined && belowId === undefined) {
        return false;
      }
      const targetList = await List.findOne({
        relations: ['project'],
        where: { id }
      });
      if (!targetList) {
        throw new Error('List does not exist');
      }

      // move target to bottom of list
      if (belowId === undefined) {
        // get pos of last list
        targetList.pos = targetList.project.lastPos + buffer;
      }

      // move target to top of list
      else if (aboveId === undefined) {
        // get pos of first list
        const firstList = targetList.project.lists.find(list => {
          return list.id === parseInt(belowId);
        });
        if (!firstList) {
          throw new Error('First list does not exist');
        }
        targetList.pos = firstList.pos / 2;
      }

      // move target between aboveList and belowList
      else {
        const aboveList = targetList.project.lists.find(
          list => list.id === parseInt(aboveId!)
        );
        if (!aboveList) {
          throw new Error('List above does not exist');
        }
        const belowList = targetList.project.lists.find(
          list => list.id === parseInt(belowId!)
        );
        if (!belowList) {
          throw new Error('List below does not exist');
        }

        targetList.pos = (aboveList.pos + belowList.pos) / 2;
      }
      // TODO check if pos numbers get too close to each other .0001 apart or smth
      // renumber the cards and nearby cards

      await targetList.save();
      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
