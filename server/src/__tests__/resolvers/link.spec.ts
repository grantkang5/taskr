import { gql } from "apollo-server-express";
import { testServer, createTestDb, closeTestDb } from "../mocks/server";
import { Connection } from "typeorm";
import faker from "faker";
import { createTestClient } from "apollo-server-testing";
const { query, mutate } = createTestClient(testServer);

describe("Team Resolver", () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createTestDb();
  });

  afterAll(() => {
    closeTestDb(connection);
  });

  const mocks = {
    email: faker.internet.email(),
    projectId: 1
  };

  describe("ValidateLink query", () => {
    it("should validate an invitation link", async () => {
      const teamInviteLink = await mutate({
        mutation: gql`
          mutation SendTeamInviteLink($teamId: ID!, $email: String!) {
            sendTeamInviteLink(teamId: $teamId, email: $email)
          }
        `,
        variables: {
          teamId: 1,
          email: mocks.email
        }
      });

      expect(teamInviteLink.data).toBeDefined();
      expect(teamInviteLink.errors).toBeUndefined();

      const validateLink = await query({
        query: gql`
          query ValidateLink($link: String!, $key: String!) {
            validateLink(link: $link, key: $key)
          }
        `,
        variables: {
          link: teamInviteLink.data!.sendTeamInviteLink,
          key: `team-invite-${mocks.email}`
        }
      });

      expect(validateLink.data).toBeDefined();
      expect(validateLink.errors).toBeUndefined();
    });
  });

  describe("ValidatePublicProjectLink query", () => {
    it("should validate a public project link", async () => {
      const { data, errors } = await query({
        query: gql`
          query GetPublicProjectLink($projectId: ID!) {
            getPublicProjectLink(projectId:$projectId)
          }
        `,
        variables: {
          projectId: mocks.projectId
        }
      })

      expect(data).toBeDefined();
      expect(errors).toBeUndefined();

      const validator = await query({
        query: gql`
          query ValidatePublicProjectLink($projectId: ID!, $link: String!) {
            validatePublicProjectLink(projectId:$projectId, link:$link)
          }
        `,
        variables: {
          projectId: mocks.projectId,
          link: data!.getPublicProjectLink
        }
      })

      expect(validator.data).toBeDefined();
      expect(validator.errors).toBeUndefined();
    })
  })
});
