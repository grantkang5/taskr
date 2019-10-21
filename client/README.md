heroku: http://www.taskr-app.com/

This project is built using Next.js to assist in server-side rendering our React app. It's built using typescript and uses graphql-codegen to build out our graphql hooks.

# Taskr client

#### Table of Contents
[Installation](###Installation)
[Getting started](###Getting_started)
[Generate graphql](###Generate_graphql)
[Routing](###Routing)
[Graphql](###Graphql)
[Styling](###Styling)
[Tests](###Tests)
[Making a pull request](###Making_a_pull_request)

### Installation
1. `npm install` or `yarn`
---------

### Getting started

1. Create an `.env` file in `client/` following the `.env.sample` file
2. Start the api server (cd into `/server` and run `yarn dev` after installing dependencies)
3. Run `yarn codegen` from the client directory and it will automatically generate types, queries and the hooks for all your graphql queries and mutations.
4. All types are generated in the `generated` folder and can be exported from there.
5. `yarn codegen` will generate a watch server so make sure to turn it off if you don't need it anymore
6. Run `yarn dev` to get started
------

### Routing
Routing is handled by nextjs
##### With hooks
```jsx
import { useRouter } from 'next/router';
const App = () => {
    const router = useRouter();
    const handleClick = () => {
        router.push('/login')
    }

    return <button onClick={handleClick}>Click</button>
}
```
##### Link
```jsx
import Link from 'next/link';
const App = () => (
    <ul>
        <li>
            <Link href="/login" as "/login>Log in</Link>
        </li>
        <li>
            <Link href="/signup" as "/signup>Sign up</Link>
        </li>
    </ul>
)
```
##### Creating routes
- Routes can be created in the `pages` directory. Every file there will be rendered as its own route in relation to its file name. _ie._ `home.tsx` will be rendered in `/home`.
- `pages/index.tsx` is served on `/`
- `pages/user/me.tsx` is served on `/user/me`
- `pages/user/[userId].tsx` is served on `/user/:userId` with `userId` as a query params
- You can always render a route directly from another component, however it will not modify the current route from the browser.
- Always render new pages with the `Layout` component to render headers, title, etc.
```jsx
// pages/posts.tsx
import Layout from '../components/common/Layout'

const PostsPage = () => (
    <Layout>
        <div>
            Posts
        </div>
    </Layout>
)

export default PostsPage
```

____

### Graphql
https://www.apollographql.com/docs/react/api/react-hooks/
- We are using apollo-client to connect to our apollo backend
- Queries/mutations/subscriptions can be created under the `graphql` directory with the `*.graphql` extension
- `yarn codegen` will create watch for any changes under `graphql` and create types, hooks, and the query itself within `generated/graphql`.

##### Using queries
```jsx
import { useMeQuery } from "../generated/graphql"

const App = () => {
    const { data, loading, error } = useMeQuery();

    if (loading) {
        return <div>loading...</div>
    }
    if (error || !data.me) {
        return <></>
    }
    return <div>{data.me}</div>
}
```
##### Using mutations
```jsx
import { useMessageMutation } from "../generated/graphql"

const App = () => {
    const [message, { loading }] = useMessageMutation();

    const handleClick = () => {
        message({
            variables: { message: 'hello world' }
        })
    }

    return <button loading={loading} onClick={handleClick}>Click</button>
}
```
- If you ever need access to the direct query tags for tests or refetchQueries, those are also generated.
```jsx
import { useMessageMutation, MessageDocument } from "../generated/graphql"

const App = () => {
    const [message, { loading }] = useMessageMutation();

    const handleClick = () => {
        message({
            variables: { message: 'hello world' }
            refetchQueries: [{ query: MessageDocument }]
        })
    }

    return <button loading={loading} onClick={handleClick}>Click</button>
}
```
##### Using lazy queries
If you need to fire a query manually rather than on component mount, you can use lazyQueries which are also generated

```jsx
import { useMeLazyQuery } from "../generated/graphql"

const App = () => {
    const [getMe, { called, loading, data }] = useMeLazyQuery();
    const handleClick = () => getMe() // fetching me query

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <>
            <div>{data.me || 'Not logged in'}</div>
            <button onClick={handleClick}>Log in</button>
        </>
    )
}
```

### Styling
- Use CSS modules pattern and less
- Avoid inline styles unless passing down as props
```css
/** App.module.less */
.main {
    display: flex;
    width: 100%;
}

```
##### Theme
Variables can be imported under `assets/themes.less`
```css
@import '../assets/themes.less`;

.main {
    display: flex;
    background-color: @primary-color;
}
```

##### Antd themes
https://ant.design/docs/react/customize-theme
Antd themes can be changed in `next.config.js` under `lessLoaderOptions.modifyVars`

________

### Components
##### Text

```jsx
import { HeaderText, SubText } from "components/common/Text";

export default () => (
    <>
        <HeaderText style={{ marginBottom: '5px' }} white={1}>Hello</HeaderText>
        <SubText style={{ marginBottom: '5px' }}>World</SubText>
    </>
)
```

| Prop               | Description                       | Type        | Default        | Required |
| ------------------ | --------------------------------- | ----------- | -------------- | -------- |
| **`style`**        | Style                             | _(object)_  | _undefined_    | ❌ |
| **`white`**        | Text color white                             | _(number)_     | _undefined_    | ❌       |
| **`children`**         | Children | _(ReactNode)_  | _undefined_    | ✅             |

_________

### Tests 🔀
Tests are written using `jest` + `enzyme`
- Run `yarn test` to run tests

`@apollo/react-testing` ~ Use `MockedProvider` to mock queries to an apollo-server
```jsx
import * as React from 'react';
import { render } from 'enzyme';
import Home from '../../pages/home';
import { MockedProvider } from '@apollo/react-testing';
import { MeDocument } from '../../generated/graphql';

describe('Pages', () => {
  describe('Home', () => {
    const mocks = [
      {
        request: {
          query: MeDocument
        },
        result: {
          data: {
            me: { id: 1, email: 'example@email.com' }
          }
        }
      }
    ];

    it('should render and call me query', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Home />
        </MockedProvider>
      );
    });
  }
}
```
____

### Making a pull request
1. Assign a ticket to yourself on trello and move it to `Doing` column
2. `git checkout -b client/feature`
3. Make and commit changes, push and create a PR
4. Resolve all merge conflicts
5. Once PR passes the CI tests you can go ahead and `rebase and merge` to `master`
6. Delete the branch after successfully merged.

