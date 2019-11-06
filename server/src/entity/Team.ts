import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User';
import { Project } from './Project';

@ObjectType()
@Entity('teams')
export class Team extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [User])
  @ManyToMany(() => User, user => user.teams, {
    eager: true
  })
  members: User[]

  @Field(() => [Project])
  @OneToMany(() => Project, project => project.team, {
    eager: true
  })
  projects: Project[]
}
