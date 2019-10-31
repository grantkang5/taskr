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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any,
};


export type ImageResponse = {
   __typename?: 'ImageResponse',
  public_id: Scalars['String'],
  width: Scalars['Float'],
  height: Scalars['Float'],
  format: Scalars['String'],
  created_at: Scalars['String'],
  bytes: Scalars['Float'],
  url: Scalars['String'],
  secure_url: Scalars['String'],
  original_filename: Scalars['String'],
};

export type LoginResponse = {
   __typename?: 'LoginResponse',
  accessToken: Scalars['String'],
  user: User,
};

export type Mutation = {
   __typename?: 'Mutation',
  deleteTeam: Team,
  deleteUser: User,
  sendVerificationLink: Scalars['String'],
  resendVerificationLink: Scalars['String'],
  register: LoginResponse,
  login: LoginResponse,
  logout: Scalars['Boolean'],
  auth_googleOAuth: LoginResponse,
  createAvatar: ImageResponse,
  updateAvatar: ImageResponse,
  updateUsername: User,
  sendForgotPasswordLink: Scalars['String'],
  forgotPassword: Scalars['Boolean'],
  changePassword: Scalars['Boolean'],
  revokeRefreshToken: Scalars['Boolean'],
  createTeam: Team,
  sendTeamInviteLink: Scalars['String'],
  acceptTeamInviteLink: Scalars['Boolean'],
  deleteTeamMember: Scalars['Boolean'],
  updateTeam: Team,
};


export type MutationDeleteTeamArgs = {
  id: Scalars['Int']
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int']
};


export type MutationSendVerificationLinkArgs = {
  password: Scalars['String'],
  email: Scalars['String']
};


export type MutationResendVerificationLinkArgs = {
  email: Scalars['String']
};


export type MutationRegisterArgs = {
  verificationLink: Scalars['String'],
  email: Scalars['String']
};


export type MutationLoginArgs = {
  password: Scalars['String'],
  email: Scalars['String']
};


export type MutationAuth_GoogleOAuthArgs = {
  code: Scalars['String']
};


export type MutationCreateAvatarArgs = {
  image: Scalars['String']
};


export type MutationUpdateAvatarArgs = {
  image: Scalars['String']
};


export type MutationUpdateUsernameArgs = {
  username: Scalars['String']
};


export type MutationSendForgotPasswordLinkArgs = {
  email: Scalars['String']
};


export type MutationForgotPasswordArgs = {
  password: Scalars['String'],
  forgotPasswordLink: Scalars['String'],
  email: Scalars['String']
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'],
  currentPassword: Scalars['String']
};


export type MutationRevokeRefreshTokenArgs = {
  userId: Scalars['Int']
};


export type MutationCreateTeamArgs = {
  name: Scalars['String']
};


export type MutationSendTeamInviteLinkArgs = {
  email: Scalars['String'],
  teamId: Scalars['Int']
};


export type MutationAcceptTeamInviteLinkArgs = {
  teamInviteLink: Scalars['String'],
  email: Scalars['String']
};


export type MutationDeleteTeamMemberArgs = {
  userId: Scalars['Int'],
  teamId: Scalars['Int']
};


export type MutationUpdateTeamArgs = {
  name: Scalars['String'],
  teamId: Scalars['Int']
};

export type Query = {
   __typename?: 'Query',
  getAllTeams: Array<Team>,
  getTeam: Team,
  getAllUsers: Array<User>,
  getUser: User,
  me: User,
  login_googleOAuth: Scalars['String'],
  getUserTeams: Array<Team>,
};


export type QueryGetTeamArgs = {
  id: Scalars['Int']
};


export type QueryGetUserArgs = {
  id: Scalars['Int']
};

export type Team = {
   __typename?: 'Team',
  id: Scalars['Int'],
  name: Scalars['String'],
  created_at: Scalars['DateTime'],
  updated_at: Scalars['DateTime'],
  members: Array<User>,
};

export type User = {
   __typename?: 'User',
  id: Scalars['Int'],
  email: Scalars['String'],
  username: Scalars['String'],
  avatar: Scalars['String'],
  auth: Scalars['String'],
  teams: Array<Team>,
};

export type CreateTeamMutationVariables = {
  name: Scalars['String']
};


export type CreateTeamMutation = (
  { __typename?: 'Mutation' }
  & { createTeam: (
    { __typename?: 'Team' }
    & Pick<Team, 'id' | 'name'>
  ) }
);

export type GetTeamQueryVariables = {
  id: Scalars['Int']
};


export type GetTeamQuery = (
  { __typename?: 'Query' }
  & { getTeam: (
    { __typename?: 'Team' }
    & Pick<Team, 'id' | 'name'>
  ) }
);

export type GetUserTeamsQueryVariables = {};


export type GetUserTeamsQuery = (
  { __typename?: 'Query' }
  & { getUserTeams: Array<(
    { __typename?: 'Team' }
    & Pick<Team, 'id' | 'name'>
  )> }
);

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

export type ChangePasswordMutationVariables = {
  currentPassword: Scalars['String'],
  newPassword: Scalars['String']
};


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changePassword'>
);

export type ForgotPasswordMutationVariables = {
  email: Scalars['String'],
  forgotPasswordLink: Scalars['String'],
  password: Scalars['String']
};


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
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
    & Pick<User, 'id' | 'email' | 'username'>
  ) }
);

export type RegisterMutationVariables = {
  email: Scalars['String'],
  verificationLink: Scalars['String']
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
  ) }
);

export type ResendVerificationLinkMutationVariables = {
  email: Scalars['String']
};


export type ResendVerificationLinkMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resendVerificationLink'>
);

export type SendForgotPasswordLinkMutationVariables = {
  email: Scalars['String']
};


export type SendForgotPasswordLinkMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendForgotPasswordLink'>
);

export type SendVerificationLinkMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type SendVerificationLinkMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendVerificationLink'>
);

export type UpdateUsernameMutationVariables = {
  username: Scalars['String']
};


export type UpdateUsernameMutation = (
  { __typename?: 'Mutation' }
  & { updateUsername: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'username'>
  ) }
);


export const CreateTeamDocument = gql`
    mutation CreateTeam($name: String!) {
  createTeam(name: $name) {
    id
    name
  }
}
    `;
export type CreateTeamMutationFn = ApolloReactCommon.MutationFunction<CreateTeamMutation, CreateTeamMutationVariables>;

    export function useCreateTeamMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>) {
      return ApolloReactHooks.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(CreateTeamDocument, baseOptions);
    }
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>;
export type CreateTeamMutationResult = ApolloReactCommon.MutationResult<CreateTeamMutation>;
export type CreateTeamMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTeamMutation, CreateTeamMutationVariables>;
export const GetTeamDocument = gql`
    query GetTeam($id: Int!) {
  getTeam(id: $id) {
    id
    name
  }
}
    `;

    export function useGetTeamQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
      return ApolloReactHooks.useQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, baseOptions);
    }
      export function useGetTeamLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTeamQuery, GetTeamQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<GetTeamQuery, GetTeamQueryVariables>(GetTeamDocument, baseOptions);
      }
      
export type GetTeamQueryHookResult = ReturnType<typeof useGetTeamQuery>;
export type GetTeamQueryResult = ApolloReactCommon.QueryResult<GetTeamQuery, GetTeamQueryVariables>;
export const GetUserTeamsDocument = gql`
    query GetUserTeams {
  getUserTeams {
    id
    name
  }
}
    `;

    export function useGetUserTeamsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserTeamsQuery, GetUserTeamsQueryVariables>) {
      return ApolloReactHooks.useQuery<GetUserTeamsQuery, GetUserTeamsQueryVariables>(GetUserTeamsDocument, baseOptions);
    }
      export function useGetUserTeamsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserTeamsQuery, GetUserTeamsQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<GetUserTeamsQuery, GetUserTeamsQueryVariables>(GetUserTeamsDocument, baseOptions);
      }
      
export type GetUserTeamsQueryHookResult = ReturnType<typeof useGetUserTeamsQuery>;
export type GetUserTeamsQueryResult = ApolloReactCommon.QueryResult<GetUserTeamsQuery, GetUserTeamsQueryVariables>;
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
export const ChangePasswordDocument = gql`
    mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
  changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
}
    `;
export type ChangePasswordMutationFn = ApolloReactCommon.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

    export function useChangePasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
      return ApolloReactHooks.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
    }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = ApolloReactCommon.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation forgotPassword($email: String!, $forgotPasswordLink: String!, $password: String!) {
  forgotPassword(email: $email, forgotPasswordLink: $forgotPasswordLink, password: $password)
}
    `;
export type ForgotPasswordMutationFn = ApolloReactCommon.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

    export function useForgotPasswordMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
      return ApolloReactHooks.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, baseOptions);
    }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = ApolloReactCommon.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
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
    username
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
    mutation Register($email: String!, $verificationLink: String!) {
  register(email: $email, verificationLink: $verificationLink) {
    accessToken
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
export const ResendVerificationLinkDocument = gql`
    mutation ResendVerificationLink($email: String!) {
  resendVerificationLink(email: $email)
}
    `;
export type ResendVerificationLinkMutationFn = ApolloReactCommon.MutationFunction<ResendVerificationLinkMutation, ResendVerificationLinkMutationVariables>;

    export function useResendVerificationLinkMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResendVerificationLinkMutation, ResendVerificationLinkMutationVariables>) {
      return ApolloReactHooks.useMutation<ResendVerificationLinkMutation, ResendVerificationLinkMutationVariables>(ResendVerificationLinkDocument, baseOptions);
    }
export type ResendVerificationLinkMutationHookResult = ReturnType<typeof useResendVerificationLinkMutation>;
export type ResendVerificationLinkMutationResult = ApolloReactCommon.MutationResult<ResendVerificationLinkMutation>;
export type ResendVerificationLinkMutationOptions = ApolloReactCommon.BaseMutationOptions<ResendVerificationLinkMutation, ResendVerificationLinkMutationVariables>;
export const SendForgotPasswordLinkDocument = gql`
    mutation SendForgotPasswordLink($email: String!) {
  sendForgotPasswordLink(email: $email)
}
    `;
export type SendForgotPasswordLinkMutationFn = ApolloReactCommon.MutationFunction<SendForgotPasswordLinkMutation, SendForgotPasswordLinkMutationVariables>;

    export function useSendForgotPasswordLinkMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendForgotPasswordLinkMutation, SendForgotPasswordLinkMutationVariables>) {
      return ApolloReactHooks.useMutation<SendForgotPasswordLinkMutation, SendForgotPasswordLinkMutationVariables>(SendForgotPasswordLinkDocument, baseOptions);
    }
export type SendForgotPasswordLinkMutationHookResult = ReturnType<typeof useSendForgotPasswordLinkMutation>;
export type SendForgotPasswordLinkMutationResult = ApolloReactCommon.MutationResult<SendForgotPasswordLinkMutation>;
export type SendForgotPasswordLinkMutationOptions = ApolloReactCommon.BaseMutationOptions<SendForgotPasswordLinkMutation, SendForgotPasswordLinkMutationVariables>;
export const SendVerificationLinkDocument = gql`
    mutation SendVerificationLink($email: String!, $password: String!) {
  sendVerificationLink(email: $email, password: $password)
}
    `;
export type SendVerificationLinkMutationFn = ApolloReactCommon.MutationFunction<SendVerificationLinkMutation, SendVerificationLinkMutationVariables>;

    export function useSendVerificationLinkMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendVerificationLinkMutation, SendVerificationLinkMutationVariables>) {
      return ApolloReactHooks.useMutation<SendVerificationLinkMutation, SendVerificationLinkMutationVariables>(SendVerificationLinkDocument, baseOptions);
    }
export type SendVerificationLinkMutationHookResult = ReturnType<typeof useSendVerificationLinkMutation>;
export type SendVerificationLinkMutationResult = ApolloReactCommon.MutationResult<SendVerificationLinkMutation>;
export type SendVerificationLinkMutationOptions = ApolloReactCommon.BaseMutationOptions<SendVerificationLinkMutation, SendVerificationLinkMutationVariables>;
export const UpdateUsernameDocument = gql`
    mutation UpdateUsername($username: String!) {
  updateUsername(username: $username) {
    id
    email
    username
  }
}
    `;
export type UpdateUsernameMutationFn = ApolloReactCommon.MutationFunction<UpdateUsernameMutation, UpdateUsernameMutationVariables>;

    export function useUpdateUsernameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUsernameMutation, UpdateUsernameMutationVariables>) {
      return ApolloReactHooks.useMutation<UpdateUsernameMutation, UpdateUsernameMutationVariables>(UpdateUsernameDocument, baseOptions);
    }
export type UpdateUsernameMutationHookResult = ReturnType<typeof useUpdateUsernameMutation>;
export type UpdateUsernameMutationResult = ApolloReactCommon.MutationResult<UpdateUsernameMutation>;
export type UpdateUsernameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUsernameMutation, UpdateUsernameMutationVariables>;