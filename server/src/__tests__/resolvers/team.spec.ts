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
    name: faker.random.word(),
    email: faker.internet.email()
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

  describe("CreateTeam and DeleteTeam mutation", () => {
    it("should create a team from the db and then delete it", async () => {
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

      const deleteTeam = await mutate({
        mutation: gql`
          mutation DeleteTeam($id: ID!) {
            deleteTeam(id: $id) {
              id
              name
            }
          }
        `,
        variables: { id: team!.id }
      });

      expect(deleteTeam.data).toBeDefined();
      expect(deleteTeam.errors).toBeUndefined();
    });
  });

  describe("SendTeamInviteLink and AcceptTeamInviteLink mutation", () => {
    it("should send a team invite to an email address and add a user to the team", async () => {
      const teamInviteLink = await mutate({
        mutation: gql`
          mutation SendTeamInviteLink($teamId: ID!, $email: String!) {
            sendTeamInviteLink(teamId: $teamId, email: $email)
          }
        `,
        variables: {
          teamId: 1,
          email: mockTeam.email
        }
      });

      expect(teamInviteLink.data).toBeDefined();
      expect(teamInviteLink.errors).toBeUndefined();

      const res = await mutate({
        mutation: gql`
          mutation AcceptTeamInviteLink(
            $email: String!
            $teamInviteLink: String!
          ) {
            acceptTeamInviteLink(email: $email, teamInviteLink: $teamInviteLink)
          }
        `,
        variables: {
          email: mockTeam.email,
          teamInviteLink: teamInviteLink.data!.sendTeamInviteLink
        }
      });

      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();
    });
  });
});
