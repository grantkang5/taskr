import { Connection } from 'typeorm';
import { gql } from 'apollo-server-express';
import faker from 'faker';
import { createTestDb, closeTestDb, testServer } from '../mocks/server';

import { createTestClient } from 'apollo-server-testing';
import { List } from '../../entity/List';
const { mutate } = createTestClient(testServer);

describe('List Resolver', () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createTestDb();
  });

  afterAll(() => {
    closeTestDb(connection);
  });

  // createList
  // updateListPos
  // updateListName

  const mockList = {
    id: 1,
    name: faker.commerce.product(),
    projectId: 1,
    aboveId: 2,
    belowId: 3
  };

  describe('createList mutation', () => {
    it('should create a list in the db', async () => {
      const createList = await mutate({
        mutation: gql`
          mutation CreateList($name: String!, $projectId: ID!) {
            createList(name: $name, projectId: $projectId) {
              id
              name
            }
          }
        `,
        variables: { name: mockList.name, projectId: mockList.projectId }
      });

      const list = await List.findOne({
        where: { id: createList.data!.createList.id }
      });

      expect(parseInt(createList.data!.createList.id)).toEqual(list!.id);
      expect(createList.data).toBeDefined();
      expect(createList.errors).toBeUndefined();
    });
  });

  describe('updateList mutation', () => {
    it('should update name of list in the db', async () => {
      const updateListName = await mutate({
        mutation: gql`
          mutation UpdateListName($name: String!, $id: ID!) {
            updateListName(name: $name, id: $id)
          }
        `,
        variables: { name: mockList.name, id: mockList.id }
      });

      expect(updateListName.data).toBeDefined();
      expect(updateListName.errors).toBeUndefined();
    });
  });

  describe('updateListPos mutation', () => {
    it('should update position of list in db', async () => {
      const updateListPos = await mutate({
        mutation: gql`
          mutation UpdateListPos($id: ID!, $aboveId: ID!, $belowId: ID!) {
            updateListPos(id: $id, aboveId: $aboveId, belowId: $belowId)
          }
        `,
        variables: {
          id: mockList.id,
          aboveId: mockList.aboveId,
          belowId: mockList.belowId
        }
      });

      expect(updateListPos.data).toBeDefined();
      expect(updateListPos.errors).toBeUndefined();
    });
  });
});
