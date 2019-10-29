import {
    Resolver,
    Query,
    Mutation,
    Arg
} from 'type-graphql';
import { Project } from 'src/entity/Project';

@Resolver() 
export class ProjectResolver {
    @Query(() => [Project])
    async projects() {
        return await Project.find();
    }
    
    @Mutation(() => Project)
    async addProject(
        @Arg('name') name: string
    ) {
        try {
            const project = await Project.create({
                name
            }).save();
            return project;
        } catch (err) {
            return err;
        }
    }
}
