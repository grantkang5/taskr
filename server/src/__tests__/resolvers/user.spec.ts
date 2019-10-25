import { gql } from "apollo-server-express";
import { testServer, createTestDb, closeTestDb } from "../mocks/server";
import { Connection } from "typeorm";
import { User } from "../../entity/User";
import faker from 'faker';

import { createTestClient } from "apollo-server-testing";
const { query, mutate } = createTestClient(testServer);

describe("User Resolver", () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createTestDb();
  });

  afterAll(() => {
    closeTestDb(connection);
  });

  const mockUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    newPassword: faker.internet.password(),
  }

  describe("SendVerificationLink and Register mutation", () => {
    it("should register a user into the db", async () => {
      const sendVerificationLink = await mutate({
        mutation: gql`
          mutation SendVerificationLink($email: String!, $password: String!) {
            sendVerificationLink(email: $email, password: $password)
          }
        `,
        variables: { email: mockUser.email, password: mockUser.password }
      });
      expect(sendVerificationLink.data).toBeDefined();
      expect(sendVerificationLink.errors).toBeUndefined();

      const register = await mutate({
        mutation: gql`
          mutation Register($email: String!, $verificationLink: String!) {
            register(email: $email, verificationLink: $verificationLink) {
              accessToken
            }
          }
        `,
        variables: {
          email: mockUser.email,
          verificationLink: sendVerificationLink.data!.sendVerificationLink
        }
      });
      const user = await User.findOne({ email: mockUser.email });

      expect(user!.email).toEqual(mockUser.email);
      expect(register.data).toBeDefined();
      expect(register.errors).toBeUndefined();
    });
  });

  describe("Login mutation", () => {
    it("should return an accessToken", async () => {
      const res = await mutate({
        mutation: gql`
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              accessToken
            }
          }
        `,
        variables: { email: mockUser.email, password: mockUser.password }
      });
      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();
    });
  });

  describe("Me query", () => {
    it("should fetch a current user", async () => {
      const res = await query({
        query: gql`
          query Me {
            me {
              id
              email
            }
          }
        `
      });
      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();
      expect(res.data).toMatchSnapshot();
    });
  });

  describe("Logout mutation", () => {
    it("should log the user out", async () => {
      const res = await mutate({
        mutation: gql`
          mutation Logout {
            logout
          }
        `
      });
      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();
    });
  });

  describe("ForgotPassword mutation", () => {
    it("should send a link to user's email and then update the user's password", async () => {
      const res = await mutate({
        mutation: gql`
          mutation SendForgotPasswordLink($email: String!) {
            sendForgotPasswordLink(email:$email)
          }
        `,
        variables: { email: mockUser.email }
      })
      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();

      const forgotPassword = await mutate({
        mutation: gql`
          mutation forgotPassword($email: String!, $forgotPasswordLink: String!, $password: String!) {
            forgotPassword(email:$email, forgotPasswordLink:$forgotPasswordLink, password:$password)
          }
        `,
        variables: {
          email: mockUser.email,
          forgotPasswordLink: res.data!.sendForgotPasswordLink,
          password: mockUser.newPassword
        }
      })
      expect(forgotPassword.data).toBeDefined();
      expect(forgotPassword.errors).toBeUndefined();

      const incorrectLogin = await mutate({
        mutation: gql`
          mutation Login($email: String!, $password: String!) {
            login(email:$email, password:$password) {
              accessToken
            }
          }
        `,
        variables: { email: mockUser.email, password: mockUser.password }
      })

      expect(incorrectLogin.errors).toBeDefined()

      const successfulLogin = await mutate({
        mutation: gql`
          mutation Login($email: String!, $password: String!) {
            login(email:$email, password:$password) {
              accessToken
            }
          }
        `,
        variables: { email: mockUser.email, password: mockUser.newPassword }
      })

      expect(successfulLogin.data).toBeDefined();
      expect(successfulLogin.errors).toBeUndefined();
    });
  });
});
