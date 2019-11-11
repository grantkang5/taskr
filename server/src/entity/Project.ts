import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';
import { List } from './List';
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

  @Column({ type: 'double precision', default: 0 })
  maxPos: number;

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

  @Field(() => [List])
  @OneToMany(() => List, list => list.project, {
    cascade: true,
    eager: true
  })
  lists: List[];

  @Field(() => [User])
  @ManyToMany(() => User, user => user.projects)
  members: User[];

  @Field(() => Team)
  @ManyToOne(() => Team, team => team.projects, {
    onDelete: "SET NULL"
  })
  team: Team;
}
