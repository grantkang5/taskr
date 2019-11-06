import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Project } from './Project';
// import { Task } from './Task';

@ObjectType()
@Entity('lists')
export class List extends BaseEntity {
  @BeforeInsert()
  async generatePos() {
    try {
      this.project.lastPos += 16384;
      await this.project.save();
      this.pos = this.project.lastPos;
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
    onDelete: 'CASCADE'
  })
  project: Project;

  // @OneToMany(() => Task, task => task.list)
  // tasks: Task[];
}
