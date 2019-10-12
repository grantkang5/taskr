heroku: https://dashboard.heroku.com/apps/dorya-api/settings
ci: https://circleci.com/gh/grantkang5/ssr-auth
board: https://trello.com/b/Y3ywap6K/superapp

# Client
    Steps to run this project:

1. Run `npm install` or `yarn` command
2. Run `yarn dev`

    Creating graphql queries and mutations
1. Start the api server by cd'ing into the server directory and running `yarn dev`
2. Once it's started you can run `yarn codegen` from the client directory and it will automatically generate types, queries and the hooks for all your graphql queries and mutations.
3. All types are generated in the `generated` directory and can be exported from there.
4. `yarn codegen` will generate a watch server so make sure to turn it off if you don't need it anymore

    Next.js (https://nextjs.org/docs)

1. We are using Next.js to build our SERVER SIDE RENDERED REACT APP
2. All you need to know is that we are SSR and NEXT.js handles most of it for us.
3. Build routes in the `pages` directory and it will automatically create new routes for us.
4. `react-router-dom` is completely replaced with next's router components such as `Link`.
5. Build dummy components in the `components` directory.

    Making a pull request
1. Assign a ticket to yourself on trello (https://trello.com/b/Y3ywap6K/superapp) and move it to `Doing` column
2. `git checkout -b client/feature`
3. Make and commit changes, push and create a PR
4. Once PR passes the CI tests you can go ahead and `rebase and merge` to `master`
5. Delete the branch after done

# Authentication

1. For authentication services we are using a custom refresh JWT based auth service run through our graphql server.
2. The `access_token` which is sent as a header on every client request is saved in-memory on `lib/accessToken.ts`
3. The `access_token` is generated on app load when our server passes a valid refresh_token saved in the browser cookies