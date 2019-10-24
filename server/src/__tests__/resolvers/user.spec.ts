import { gql } from "apollo-server-express";
import { testServer, initDb } from "../mocks/server";
import { createConnection, Connection } from "typeorm";
import { User } from "../../entity/User";

const { createTestClient } = require("apollo-server-testing");
const { query, mutate } = createTestClient(testServer);

describe("User Resolver", () => {
  let connection: Connection;
  beforeAll(async () => {
    await initDb();
    connection = await createConnection();
  });

  afterAll(() => {
    connection.close();
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
        variables: { email: "dev@email.com", password: "password" }
      });
      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();
    });
  });

  describe("SendVerificationLink and Register mutation", () => {
    it("should register a user into the db", async () => {
      const sendVerificationLink = await mutate({
        mutation: gql`
          mutation SendVerificationLink($email: String!, $password: String!) {
            sendVerificationLink(email: $email, password: $password)
          }
        `,
        variables: { email: "dev2@email.com", password: "abcd1234" }
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
          email: "dev2@email.com",
          verificationLink: sendVerificationLink.data.sendVerificationLink
        }
      });
      const user = await User.findOne({ email: "dev2@email.com" });

      expect(user!.email).toEqual("dev2@email.com");
      expect(register.data).toBeDefined();
      expect(register.errors).toBeUndefined();
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
});
