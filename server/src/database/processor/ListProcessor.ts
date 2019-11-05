import { IProcessor } from 'typeorm-fixtures-cli';
import { List } from '../../entity/List';
import { Project } from '../../entity/Project';
// import { Project } from '../../entity/Project';

// inclusive, exclusive
// function getRandomInt(min: number, max: number) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

export default class ListProcessor implements IProcessor<List> {
  async preProcess(_name: string, object: any): Promise<any> {
    const project = await Project.findOne({ where: { id: object.project.id } });
    return { ...object, project };
  }
  async postProcess(_name: string, object: any): Promise<any> {
    console.log('object.project is', object.project.lastPos);
    return object;
  }
}
