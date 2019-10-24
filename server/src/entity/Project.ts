import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
<<<<<<< HEAD
=======
  JoinTable,
>>>>>>> aef5341cfe9d4144aedb1810bff3b85bf477d6ce
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
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

  @Field()
  @Column()
  owner: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => User)
  users: User[];

  @OneToMany(() => List, list => list.project)
  lists: List[];

  @OneToMany(() => Label, label => label.project)
  labels: Label[];
}
