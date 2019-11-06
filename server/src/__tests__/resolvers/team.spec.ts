import { gql } from "apollo-server-express";
import { testServer, createTestDb, closeTestDb } from "../mocks/server";
import { Connection } from "typeorm";
import faker from "faker";

import { createTestClient } from "apollo-server-testing";
import { Team } from "../../entity/Team";
const { query, mutate } = createTestClient(testServer);

describe("Team Resolver", () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createTestDb();
  });

  afterAll(() => {
    closeTestDb(connection);
  });

  const mockTeam = {
    name: faker.random.word()
  };

  describe("GetUserTeam query", () => {
    it("should retrieve a team from the user using teamId", async () => {
      const res = await query({
        query: gql`
          query GetUserTeam($id: ID!) {
            getUserTeam(id: $id) {
              id
              name
            }
          }
        `,
        variables: {
          id: 1
        }
      });

      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();
    });
  });

  describe("GetUserTeams query", () => {
    it("should retrieve all teams from the user", async () => {
      const res = await query({
        query: gql`
          query GetUserTeams {
            getUserTeams {
              id
              name
            }
          }
        `
      });

      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();
    });
  });

  describe("DeleteTeam mutation", () => {
    it("should remove a team from the db using teamId", async () => {
      const res = await mutate({
        mutation: gql`
          mutation DeleteTeam($id: ID!) {
            deleteTeam(id: $id) {
              id
              name
            }
          }
        `,
        variables: { id: 1 }
      });

      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();
    });
  });

  describe("CreateTeam mutation", () => {
    it("should create a team from the db and add the user as a member", async () => {
      const res = await mutate({
        mutation: gql`
          mutation CreateTeam($name: String!) {
            createTeam(name: $name) {
              id
              name
            }
          }
        `,
        variables: {
          name: mockTeam.name
        }
      });

      const team = await Team.findOne({ where: { name: mockTeam.name } });

      expect(res.data).toBeDefined();
      expect(team).toBeDefined();
      expect(team!.members).toHaveLength(1);
      expect(res.errors).toBeUndefined();
    });
  });
});
