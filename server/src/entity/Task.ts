import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  ManyToOne
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Message } from './Message';
import { User } from './User';
import { Label } from './Label';
import { List } from './List';

@ObjectType()
@Entity('tasks')
export class Task extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  dueDate: Date;

  @Field()
  @Column()
  position: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => User)
  users: User[];

  @ManyToOne(() => List, list => list.tasks)
  list: List;

  @ManyToMany(() => Label)
  labels: Label[];

  @OneToMany(() => Message, message => message.task)
  messages: Message[];
}
