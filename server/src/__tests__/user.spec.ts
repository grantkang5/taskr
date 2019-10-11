
import { gql } from 'apollo-server-express'
import { server } from '../server'

const { createTestClient } = require('apollo-server-testing')
const { query } = createTestClient(server)

describe('User Resolver', () => {
  it('should fetch current user', async () => {
    const res = await query({
      query: gql`
        query Me {
          me {
            id
            email
          }
        }
      `
    })

    console.log('res; ', res)

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchSnapshot()
  })
})