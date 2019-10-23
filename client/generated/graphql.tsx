import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type LoginResponse = {
   __typename?: 'LoginResponse',
  accessToken: Scalars['String'],
  user: User,
};

export type Mutation = {
   __typename?: 'Mutation',
  register: User,
  login: LoginResponse,
  logout: Scalars['Boolean'],
  auth_googleOAuth: LoginResponse,
  hello: Scalars['String'],
};


export type MutationRegisterArgs = {
  password: Scalars['String'],
  email: Scalars['String']
};


export type MutationLoginArgs = {
  password: Scalars['String'],
  email: Scalars['String']
};


export type MutationAuth_GoogleOAuthArgs = {
  code: Scalars['String']
};

export type Query = {
   __typename?: 'Query',
  users: Array<User>,
  bye: Scalars['String'],
  me: User,
  login_googleOAuth: Scalars['String'],
};

export type Subscription = {
   __typename?: 'Subscription',
  helloSubscription: Scalars['String'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['Int'],
  email: Scalars['String'],
  auth: Scalars['String'],
};

export type Auth_GoogleOAuthMutationVariables = {
  code: Scalars['String']
};


export type Auth_GoogleOAuthMutation = (
  { __typename?: 'Mutation' }
  & { auth_googleOAuth: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
  ) }
);

export type ByeQueryVariables = {};


export type ByeQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'bye'>
);

export type Google_OAuthQueryVariables = {};


export type Google_OAuthQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'login_googleOAuth'>
);

export type LoginMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
  ) }
);

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  ) }
);

export type RegisterMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  ) }
);

export type UsersQueryVariables = {};


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  )> }
);


export const Auth_GoogleOAuthDocument = gql`
    mutation Auth_GoogleOAuth($code: String!) {
  auth_googleOAuth(code: $code) {
    accessToken
  }
}
    `;
export type Auth_GoogleOAuthMutationFn = ApolloReactCommon.MutationFunction<Auth_GoogleOAuthMutation, Auth_GoogleOAuthMutationVariables>;

    export function useAuth_GoogleOAuthMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<Auth_GoogleOAuthMutation, Auth_GoogleOAuthMutationVariables>) {
      return ApolloReactHooks.useMutation<Auth_GoogleOAuthMutation, Auth_GoogleOAuthMutationVariables>(Auth_GoogleOAuthDocument, baseOptions);
    }
export type Auth_GoogleOAuthMutationHookResult = ReturnType<typeof useAuth_GoogleOAuthMutation>;
export type Auth_GoogleOAuthMutationResult = ApolloReactCommon.MutationResult<Auth_GoogleOAuthMutation>;
export type Auth_GoogleOAuthMutationOptions = ApolloReactCommon.BaseMutationOptions<Auth_GoogleOAuthMutation, Auth_GoogleOAuthMutationVariables>;
export const ByeDocument = gql`
    query Bye {
  bye
}
    `;

    export function useByeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ByeQuery, ByeQueryVariables>) {
      return ApolloReactHooks.useQuery<ByeQuery, ByeQueryVariables>(ByeDocument, baseOptions);
    }
      export function useByeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ByeQuery, ByeQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<ByeQuery, ByeQueryVariables>(ByeDocument, baseOptions);
      }
      
export type ByeQueryHookResult = ReturnType<typeof useByeQuery>;
export type ByeQueryResult = ApolloReactCommon.QueryResult<ByeQuery, ByeQueryVariables>;
export const Google_OAuthDocument = gql`
    query Google_OAuth {
  login_googleOAuth
}
    `;

    export function useGoogle_OAuthQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Google_OAuthQuery, Google_OAuthQueryVariables>) {
      return ApolloReactHooks.useQuery<Google_OAuthQuery, Google_OAuthQueryVariables>(Google_OAuthDocument, baseOptions);
    }
      export function useGoogle_OAuthLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Google_OAuthQuery, Google_OAuthQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<Google_OAuthQuery, Google_OAuthQueryVariables>(Google_OAuthDocument, baseOptions);
      }
      
export type Google_OAuthQueryHookResult = ReturnType<typeof useGoogle_OAuthQuery>;
export type Google_OAuthQueryResult = ApolloReactCommon.QueryResult<Google_OAuthQuery, Google_OAuthQueryVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

    export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
      return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
    }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

    export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
      return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
    }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
  }
}
    `;

    export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
      return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
    }
      export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
      
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password) {
    id
    email
  }
}
    `;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;

    export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
      return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
    }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    id
    email
  }
}
    `;

    export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
      return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
    }
      export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
      
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;