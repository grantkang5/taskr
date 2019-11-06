import { IProcessor } from 'typeorm-fixtures-cli';
import { List } from '../../entity/List';
import { Project } from '../../entity/Project';

export default class ListProcessor implements IProcessor<List> {
  async preProcess(_name: string, object: any): Promise<any> {
    const project = await Project.findOne({ where: { id: object.project.id } });
    return { ...object, project };
  }
}
