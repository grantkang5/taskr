import {
  Resolver,
  Query,
  UseMiddleware,
  Arg,
  Int,
  Mutation
} from "type-graphql";
import { BaseEntity } from "typeorm";
import { isAuth } from "../services/auth/isAuth";

export function createBaseResolver<T extends typeof BaseEntity>(
  suffix: string,
  Entity: T
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    protected items: T[] = [];

    @Query(() => [Entity], { name: `getAll${suffix}` })
    @UseMiddleware(isAuth)
    async getAll() {
      try {
        const entity = await Entity.find();
        return entity;
      } catch (err) {
        console.log(err);
        return err;
      }
    }

    @Query(() => Entity, { name: `get${suffix}` })
    @UseMiddleware(isAuth)
    async get(@Arg("id", () => Int) id: number) {
      try {
        const entity = await Entity.findOne({ where: { id } });
        return entity;
      } catch (err) {
        console.log(err);
        return err;
      }
    }

    @Mutation(() => Entity, { name: `delete${suffix}` })
    @UseMiddleware(isAuth)
    async delete(@Arg("id", () => Int) id: number) {
      try {
        const entity = await Entity.findOne({ where: { id } });
        if (!entity) {
          throw new Error(`Could not find ${suffix}`)
        }
        entity.remove();
        return entity;
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  }

  return BaseResolver;
}
