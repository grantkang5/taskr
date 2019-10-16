import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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
    @Column({name: "user_id"})
    userId: number;

    @Field()
    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @Field()
    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @Field(() => User)
    user: User;

    // Assoications

    @ManyToOne(() => User, user => user.projectConnection, {primary: true})
    @JoinColumn({name: 'user_id'})
    userConnection: Promise<User>;
}
