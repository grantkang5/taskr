import { IProcessor } from 'typeorm-fixtures-cli';
import { Project } from '../../entity/Project';
import { User } from '../../entity/User';

function randomExcluded(min: number, max: number, excluded: number) {
  var n = Math.floor(Math.random() * (max - min) + min);
  if (n >= excluded) n++;
  return n;
}

export default class UserProcessor implements IProcessor<Project> {
  async postProcess(_name: string, object: any): Promise<any> {
    // generate a random number from 1 - 10 that is not current
    const userId = randomExcluded(1, 10, object.owner.id);
    const user = await User.findOne({ where: { id: userId } });

    object.members.push(object.owner);
    object.members.push(user);
    return object;
  }
}
