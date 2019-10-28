heroku: http://api.taskr-app.com/

# Taskr api

#### Table of Contents
- [Installation](#Installation)
- [Getting started](#Getting_started)
- [Typeorm](#Typeorm)
- [Mailer](#Mailer)
- [Making a pull request](#Making_a_pull_request)

### Installation
1. Run `npm install` or `yarn`
___
### Getting started
1. Create `.env` file with the following keys in `.env.sample`
2. Run `yarn dev`
___
### Typeorm https://typeorm.io/#/
Connections to the database are handled using Typeorm and all related configs/settings are under `ormconfig.js`
##### Creating an entity
Typeorm will resolve all entities under the `entity` directory. Entities are classes that Typeorm uses to map a table into your database. 
```ts
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;
}
```
- `BaseEntity` - typeorm class that allows entities to resolve common database methods such as `.find`, `.findOne`, `.create`
- `Column` - Maps a column under the associated table

___
### Mailer
Emails are handled by `nodemailer`.

To use or test email sending features,
you can create an account at https://ethereal.email/ and change your mailer variables to set up the transporter.
___
### Making a pull request
1. Assign a ticket to yourself on trello and move it to `Doing` column
2. `git checkout -b server/feature`
3. Make and commit changes, push and create a PR
4. Resolve all merge conflicts
5. Once PR passes the CI tests you can go ahead and `rebase and merge` to `master`
6. Delete the branch after successfully merged