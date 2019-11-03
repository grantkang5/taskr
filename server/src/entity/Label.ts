// import {
//   BaseEntity,
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   ManyToOne,
//   ManyToMany,
//   JoinTable
// } from 'typeorm';
// import { ObjectType, Field, Int } from 'type-graphql';
// import { Project } from './Project';
// import { Task } from './Task';

// @ObjectType()
// @Entity('labels')
// export class Label extends BaseEntity {
//   @Field(() => Int)
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Field()
//   @Column()
//   name: string;

//   @Field()
//   @Column()
//   color: string;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;

//   @ManyToOne(() => Project, project => project.labels)
//   project: Project;

//   @ManyToMany(() => Task)
//   @JoinTable()
//   tasks: Task[];
// }
