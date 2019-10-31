import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Team } from "./Team";

@ObjectType()
@Entity("users")
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

  @Column("int", { default: 0 })
  tokenVersion: number;
  // TODO: make enum. 'website' | 'google'
  @Field()
  @Column({ default: "website" })
  auth: string;

  @Field(() => [Team])
  @ManyToMany(() => Team, team => team.members)
  @JoinTable()
  teams: Team[];
}
