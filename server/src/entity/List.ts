import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Project } from './Project';
import { Task } from './Task';

@ObjectType()
@Entity('lists')
export class List extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Project, project => project.lists)
  project: Project;

  @OneToMany(() => Task, task => task.list)
  tasks: Task[];
}
