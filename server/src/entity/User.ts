import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
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

  @Column("int", { default: 0 })
  tokenVersion: number;
  // TODO: make enum. 'website' | 'google'
  @Field()
  @Column({ default: 'website' })
  auth: string;
}
