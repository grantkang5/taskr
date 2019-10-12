
import { gql } from 'apollo-server-express'
import { testServer, initDb } from './mocks/server'

const { createTestClient } = require('apollo-server-testing')
const { query } = createTestClient(testServer)

describe('User Resolver', () => {
  beforeAll(async () => {
    initDb()
  })

  it('should fetch current user', async () => {
    const res = await query({
      query: gql`
        query Me {
          me {
            id
            email
          }
        }
      `,
      http: {
        headers: { 'authorization': 'yolo' }
      }
    })

    console.log('res; ', res)

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchSnapshot()
  })
})