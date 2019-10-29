import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
// import { Task } from './Task';
// import { Message } from './Message';
import { Project } from './Project';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column({ nullable: true })
  avatar: string;

  @Column('int', { default: 0 })
  tokenVersion: number;
  // TODO: make enum. 'website' | 'google'

  @Field()
  @Column({ default: 'website' })
  auth: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [Project])
  @OneToMany(() => Project, project => project.owner, {
    cascade: true,
    eager: true
  })
  ownedProjects: Project[];

  // TODO: probably need eager
  @Field(() => [Project])
  @ManyToMany(() => Project, project => project.members)
  @JoinTable()
  projects: Project[];

  // @ManyToMany(() => Task)
  // @JoinTable()
  // tasks: Task[];

  // @OneToMany(() => Message, message => message.user)
  // messages: Message[];
}
