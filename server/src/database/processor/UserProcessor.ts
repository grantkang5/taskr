import { IProcessor } from 'typeorm-fixtures-cli';
import { hashSync } from 'bcryptjs'
import { User } from '../../entity/User';

export default class UserProcessor implements IProcessor<User> {
  preProcess(_name: string, object: any): any {
    const hashedPassword = hashSync(object.password, 12)
    return { ...object, password: hashedPassword }
  }
}