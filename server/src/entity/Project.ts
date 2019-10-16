import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity('projects')
export class Project extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ unique: false })
    name: string;

    @Field()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Field()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    // Assoications

    @ManyToOne(() => User, user => user.projects)
    user: User;
}