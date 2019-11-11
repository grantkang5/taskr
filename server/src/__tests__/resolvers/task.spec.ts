import { createTestClient } from "apollo-server-testing";
import { gql } from "apollo-server-express";

import { testServer, createTestDb, closeTestDb } from "../mocks/server";
import { Connection } from "typeorm";
import faker from "faker";
import { GraphQLResponse } from "graphql-extensions";

const { query, mutate } = createTestClient(testServer);

describe("Task resolver", () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createTestDb();
  });
  afterAll(() => {
    closeTestDb(connection);
  });

  const mockTask = {
    listId: 1,
    name: faker.name.jobTitle(),
    updatedName: faker.name.jobTitle(),
    desc: faker.name.jobDescriptor()
  };

  describe("CRUD task", () => {
    let createdTask: GraphQLResponse;
    it("should create a task in a list", async () => {
      const createTask = await mutate({
        mutation: gql`
          mutation CreateTask($listId: ID!, $name: String!, $desc: String) {
            createTask(listId: $listId, name: $name, desc: $desc) {
              id
              name
            }
          }
        `,
        variables: {
          listId: mockTask.listId,
          name: mockTask.name,
          desc: mockTask.desc
        }
      });

      expect(createTask.data).toBeDefined();
      expect(createTask.data!.createTask.name).toEqual(mockTask.name);
      expect(createTask.errors).toBeUndefined();
      createdTask = createTask;
    });

    it("should retrieve all tasks in a list", async () => {
      const { data, errors } = await query({
        query: gql`
          query GetListTasks($listId: ID!) {
            getListTasks(listId: $listId) {
              id
              name
            }
          }
        `,
        variables: {
          listId: mockTask.listId
        }
      });

      expect(data).toBeDefined();
      expect(data!.getListTasks.length).toBeGreaterThanOrEqual(1)
      expect(errors).toBeUndefined();
    });

    it("should update the task in a list and return it", async () => {
      const { data, errors } = await mutate({
        mutation: gql`
          mutation UpdateTask($taskId: ID!, $name: String) {
            updateTask(taskId: $taskId, name: $name) {
              id
              name
            }
          }
        `,
        variables: {
          taskId: createdTask.data!.createTask.id,
          name: mockTask.updatedName
        }
      });

      expect(data).toBeDefined();
      expect(data!.updateTask.name).toEqual(mockTask.updatedName);
      expect(errors).toBeUndefined();
    });

    it("should delete the task and return true", async () => {
      const { data, errors } = await mutate({
        mutation: gql`
          mutation DeleteTask($taskId: ID!) {
            deleteTask(taskId: $taskId)
          }
        `,
        variables: {
          taskId: createdTask.data!.createTask.id
        }
      });

      expect(data).toBeDefined();
      expect(data!.deleteTask).toEqual(true);
      expect(errors).toBeUndefined();
    });
  });
});
