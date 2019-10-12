import { gql } from "apollo-server-express";
import { testServer, initDb } from "../mocks/server";
import { createConnection, Connection } from "typeorm";
import { User } from "../../entity/User";

const { createTestClient } = require("apollo-server-testing");
const { query, mutate } = createTestClient(testServer);

describe("User Resolver", () => {
  let connection: Connection;
  beforeAll(async () => {
    initDb();
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

  describe("Register mutation", () => {
    it("should register a user into the db", async () => {
      const res = await mutate({
        mutation: gql`
          mutation Register($email: String!, $password: String!) {
            register(email: $email, password: $password) {
              id
              email
            }
          }
        `,
        variables: { email: "dev2@email.com", password: "password" }
      });
      const user = await User.findOne({ email: "dev2@email.com" })
      expect(user!.email).toEqual('dev2@email.com')
      expect(res.data).toBeDefined()
      expect(res.errors).toBeUndefined()
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
      })
      expect(res.data).toBeDefined()
      expect(res.errors).toBeUndefined()
      expect(res.data).toMatchSnapshot();
    })
  })
});
