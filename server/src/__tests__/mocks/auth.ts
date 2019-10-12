import { gql } from "apollo-server-express"
import { getConnection, createConnection } from "typeorm"
import { User } from "../../entity/User"

export const mockAuth = async (mutate: any) => {
  try {
    await createConnection('test')
    const user = await getConnection('test').getRepository(User).findOne({ id: 1 })
    const res: User = await mutate({
      mutation: gql`
        mutation Login($email: String!, $password: String!) {
          login(email:$email, password:$password) {
            accessToken
          }
        }
      `,
      variables: { email: user!.email, password: 'password' }
    })
    return res
  } catch (err) {
    console.log('err: ', err)
    return err
  }
}