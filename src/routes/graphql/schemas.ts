import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType,
  GraphQLString,
  GraphQLList, 
  GraphQLFloat, 
  GraphQLSchema, 
  GraphQLBoolean,
  GraphQLInt,
  GraphQLEnumType
} from 'graphql';

import { UUIDType } from './types/uuid.js';

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

export const MemberTypeId = new GraphQLEnumType({
  name: "MemberTypeId",
  values: {
    BASIC: { 
      value: "basic"
    },
    BUSINESS: {
      value: "business"
    },
  }
});

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

const queries = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }) => {
        return await prisma.user.findUnique({
          where: {
            id: id,
          },
        });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {  
        return await prisma.user.findMany();
      }   
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }) => {
        return await prisma.profile.findUnique({
          where: {
            id: id
          },
        });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async () => {
        return await prisma.profile.findMany();
      }
    }, 
    memberType: {
      type: MemberType,
      args: {
        id: { type: MemberTypeId },
      },
      resolve: async (root, { id } : { id: string }) => {
        return await prisma.memberType.findUnique({
          where: {
            id: id
          }
        });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async () => {
        return await prisma.memberType.findMany();
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }) => {
        return await prisma.post.findUnique({
          where: {
            id: id,
          },
        });
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async () => {  
        return await prisma.post.findMany();
      }   
    },  
  }
});

export const schema = new GraphQLSchema({
  query: queries,
  // mutation: Mutation
});

