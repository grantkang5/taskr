import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server-express';

import { testServer, createTestDb, closeTestDb } from '../mocks/server';
import { Connection } from 'typeorm';
import faker from 'faker';
import { Project } from '../../entity/Project';

const { mutate } = createTestClient(testServer);

describe('Project Resolver', () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createTestDb();
  });
  afterAll(() => {
    closeTestDb(connection);
  });

  const mockProject = {
    name: faker.commerce.productName(),
    desc: faker.lorem.sentence()
  };

  describe('Create project', () => {
    it('should create a project into the db', async () => {
      const createProject = await mutate({
        mutation: gql`
          mutation CreateProject($name: String!, $desc: String) {
            createProject(name: $name, desc: $desc) {
              name
            }
          }
        `,
        variables: { name: mockProject.name, desc: mockProject.desc }
      });

      const project = await Project.findOne({ name: mockProject.name });

      expect(project!.name).toEqual(mockProject.name);
      expect(createProject.data).toBeDefined();
      expect(createProject.errors).toBeUndefined();
    });
  });

  const updatedProject = {
    name: faker.commerce.productName(),
    desc: faker.lorem.sentence()
  };

  describe('Update Project', () => {
    it('should update a project in the db', async () => {
      const res = await mutate({
        mutation: gql`
          mutation UpdateProject($id: Int!, $name: String, $desc: String) {
            updateProject(id: $id, name: $name, desc: $desc)
          }
        `,
        variables: {
          id: 1,
          name: updatedProject.name,
          desc: updatedProject.desc
        }
      });
      const project = await Project.findOne({ where: { id: 1 } });

      expect(project!.name).toEqual(updatedProject.name);
      expect(project!.desc).toEqual(updatedProject.desc);
      expect(res.data).toBeDefined();
      expect(res.errors).toBeUndefined();
    });
  });
});
