import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client'
import { buildSchema, GraphQLObjectType,
  GraphQLString, GraphQLList, GraphQLFloat,
  GraphQLSchema } from 'graphql';

const prisma = new PrismaClient();  

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
    },
  },
});

const queries = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {  
        return await prisma.user.findMany();
      }   
    }
  }
});

export const schema = new GraphQLSchema({
  query: queries,
  // mutation: Mutation
});

// export const schema = buildSchema(`
//   type User {
//     id: ID
//     name: String
//     balance: String
//   },
//   type Profile {
//     id: ID
//     isMale: Boolean
//     yearOfBirth: Int
//     userId: String
//     memberTypeId: String
//   }
// `);
