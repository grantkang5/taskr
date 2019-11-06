import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  // ManyToMany,
  // JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Project } from './Project';
import { Team } from './Team';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
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

  @Field(() => [Project])
  @ManyToMany(() => Project, project => project.members)
  @JoinTable()
  projects: Project[];

  @Field(() => [Team])
  @ManyToMany(() => Team, team => team.members)
  @JoinTable()
  teams: Team[];
}
