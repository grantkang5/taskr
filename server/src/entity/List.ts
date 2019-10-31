import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Project } from './Project';
// import { Task } from './Task';

@ObjectType()
@Entity('lists')
export class List extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'double precision' })
  pos: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Project)
  @ManyToOne(() => Project, project => project.lists, {
    onDelete: 'CASCADE'
  })
  project: Project;

  // @OneToMany(() => Task, task => task.list)
  // tasks: Task[];
}
