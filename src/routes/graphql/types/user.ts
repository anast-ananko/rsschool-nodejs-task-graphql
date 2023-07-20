import { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLList, 
  GraphQLFloat, 
  GraphQLInputObjectType
} from 'graphql';
import { PrismaClient } from '@prisma/client';

import { UUIDType } from '../types/uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserType = new GraphQLObjectType<any, { prisma: PrismaClient }>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async({ id }: { id: string }, args, context) => {
        return await context.prisma.profile.findUnique({
          where:{
            userId: id
          }
        })
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async({ id }: { id: string }, args, context ) => {
        return await context.prisma.post.findMany({
          where:{
            authorId: id
          }
        });
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async({ id }: { id: string }, args, context) => {
        const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
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
      resolve: async ({ id }: { id: string }, args, context) => {
        const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
          where: {
            authorId: id,
          },
          include: {
            subsriber: true, 
          },
        });

        return subscriptions.map((subscription) => subscription.subsriber);
      },
    },
  })
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export { UserType, CreateUserInput, ChangeUserInput };
