heroku: https://dashboard.heroku.com/apps/dorya-api/settings
ci: https://circleci.com/gh/grantkang5/ssr-auth
board: https://trello.com/b/Y3ywap6K/superapp

# Api
      Steps to run this project:

1. Run `npm install` or `yarn` command
2. Create `.env` file with the following keys in `.env.sample`
3. Run `yarn dev`

    Creating DB & Loading Fixtures

1. We are using postgres for this project. Start a server using psql or docker image
2. Run `yarn dev` to start the dev server
3. Run `yarn db:seed` to load fixtures to seed your database

    Making a pull request
1. Assign a ticket to yourself on trello (https://trello.com/b/Y3ywap6K/superapp) and move it to `Doing` column
2. `git checkout -b server/feature`
3. Make and commit changes, push and create a PR
4. Once PR passes the CI tests you can go ahead and `rebase and merge` to `master`
5. Delete the branch after done

# Typeorm (https://typeorm.io/) and apollo-server (https://www.apollographql.com/docs/apollo-server/)
- We are using TypeOrm ORM. Typeorm works very well with typescript environment.
- Everything about typeorm is handled through the `ormconfig.js` file.
- All you have to focus on is the `entity` and `resolvers` directories.
- Entities in Typeorm are basically tables
- Resolvers handle our schema, queries and mutations for apollo

# Fixtures
- We are using fixtures to seed our database using a janky library to help us out (https://github.com/RobinCK/typeorm-fixtures);
- Create fixtures in `database/fixtures`. They are used when running `yarn db:seed` and also used for our test-servers so keep that in mind when making sample data.