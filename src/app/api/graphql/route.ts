import { createYoga, createSchema } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { NextApiRequest, NextApiResponse } from 'next'

const typeDefinitions = /* GraphQL */ `
  type Query {
    hello: String!
  }
`
 
const resolvers = {
  Query: {
    hello: () => 'Hello World!'
  }
}
 
export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})

export default createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql'
})

