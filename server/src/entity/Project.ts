import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';
import { List } from './List';
import { Label } from './Label';

@ObjectType()
@Entity('projects')
export class Project extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  desc: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Field()
  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @ManyToMany(() => User)
  users: User[];

  @OneToMany(() => List, list => list.project)
  lists: List[];

  @OneToMany(() => Label, label => label.project)
  labels: Label[];
}
