import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  // ManyToMany,
  // OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';
// import { List } from './List';
// import { Label } from './Label';

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

  // TODO: maybe need eager
  // @Field(() => [User])
  // @ManyToMany(() => User, user => user.projects)
  // members: User[];

  // @OneToMany(() => List, list => list.project)
  // lists: List[];

  // @OneToMany(() => Label, label => label.project)
  // labels: Label[];

  @Field(() => User)
  @ManyToOne(() => User, user => user.ownedProjects, {
    onDelete: 'CASCADE'
  })
  owner: User;
}
