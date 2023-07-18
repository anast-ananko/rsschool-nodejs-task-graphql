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

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

export const MemberTypeId = new GraphQLEnumType({
  name: "MemberTypeId",
  values: {
    basic: { 
      value: "basic"
    },
    business: {
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
    memberType: {
      type: MemberType,
      resolve: async({ memberTypeId } : { memberTypeId: string }) => {
        return await prisma.memberType.findUnique({
          where:{
            id: memberTypeId
          }
        })
      }
    }
  })
});

interface IUserType {
  id: string;
  name: string;
  balance: number;
  profile: typeof ProfileType;
  posts: typeof PostType[];
  userSubscribedTo: IUserType[];
  subscribedToUser: IUserType[];
}

const UserType: GraphQLObjectType<IUserType, IUserType> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async({ id } : { id: string }) => {
        return await prisma.profile.findUnique({
          where:{
            userId: id
          }
        })
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async({ id } : { id: string }) => {
        return await prisma.post.findMany({
          where:{
            authorId: id
          }
        });
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: { id: string }) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: {
            subscriberId: id,
          },
          include: {
            author: true,
          },
        });

        return subscriptions.map((subscription) => subscription.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: { id: string }) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: {
            authorId: id,
          },
          include: {
            subsriber: true, 
          },
        });

        return subscriptions.map((subscription) => subscription.subsriber);
      },
    }
  })
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
    userSubscriptions: {
      type: new GraphQLList(UserType),
      args: {
        userId: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }) => {
        const result = await prisma.user.findUnique({
          where: {
            id: id,
          },
          include: {
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });
    
        return result ? [result] : [];
      },
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

