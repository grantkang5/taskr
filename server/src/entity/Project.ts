import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';
import { Team } from './Team';

@ObjectType()
@Entity('projects')
export class Project extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  desc: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.ownedProjects, {
    onDelete: 'CASCADE'
  })
  owner: User;

  // TODO: maybe need eager
  @Field(() => [User])
  @ManyToMany(() => User, user => user.projects)
  members: User[];

  @Field(() => Team)
  @ManyToOne(() => Team, team => team.projects, {
    cascade: true
  })
  team: Team
}
