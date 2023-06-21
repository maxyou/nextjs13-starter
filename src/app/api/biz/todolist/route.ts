import { createYoga, createSchema } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const typeDefinitions = /* GraphQL */ `
type TodoItem {
  id: ID!
  content: String!
  done: Boolean!
  userId: String!
}

type Query {
  todoItems(userId:String!): [TodoItem!]!
}

type Mutation {
  addTodoItem(content: String!, userId:String!): TodoItem!
  markTodoItemDone(id: ID!, done:String!): TodoItem!
  deleteTodoItem(id: ID!): Boolean!
}
`;


const resolvers = {
  Query: {
    todoItems: async (_: any, { userId }: { userId: string }) => {
      console.log(`query TodoItem(): ${userId}`);
      const result = await prisma.todoItem.findMany({
        where: { userId },
        orderBy: {
          done: "asc"
        },
        select: {
          id: true,
          content: true,
          done: true,
          userId: true,
        }
      });
      console.log(`query TodoItem(): ${JSON.stringify(result)}`);
      return result;
    },
  },
  Mutation: {
    addTodoItem: async (_: any, { content, userId }: { content: string, userId: string }) => {
      console.log(`addTodoItem(): ${content}`);
      return prisma.todoItem.create({
        data: { content, userId },
      });
    },
    markTodoItemDone: async (_: any, { id, done }: { id: string, done:string }) => {
      console.log(`markTodoItemDone(): ${id}`);
      return prisma.todoItem.update({
        where: { id },
        data: { done: done == 'false' },
      });
    },
    deleteTodoItem: async (_: any, { id }: { id: string }) => {
      console.log(`deleteTodoItem(): ${id}`);
      return prisma.todoItem.delete({
        where: { id },
      });
    },
  },
};

const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})

const { handleRequest } = createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/biz/todolist',
  fetchAPI: {
    Response: Response,
    Request: Request,
  },
})

export { handleRequest as GET, handleRequest as POST }