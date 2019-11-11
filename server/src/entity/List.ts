import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
  OneToMany
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Project } from './Project';
import { Task } from './Task';

@ObjectType()
@Entity('lists')
export class List extends BaseEntity {
  @BeforeInsert()
  async generatePos() {
    try {
      this.project.maxPos += 16384;
      await this.project.save();
      this.pos = this.project.maxPos;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'double precision' })
  pos: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => Project)
  @ManyToOne(() => Project, project => project.lists, {
    onDelete: 'CASCADE',
    nullable: false
  })
  project: Project;

  @Field(() => [Task])
  @OneToMany(() => Task, task => task.list)
  tasks: Task[];
}
