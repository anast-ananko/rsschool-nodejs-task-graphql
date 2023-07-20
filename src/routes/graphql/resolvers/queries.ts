import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { PrismaClient } from '@prisma/client';

import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.js';
import { ProfileType } from '../types/profile.js';
import { PostType } from '../types/post.js';
import { MemberType } from '../types/member.js';
import { MemberTypeId } from '../types/memberTypeId.js';

export const queries = new GraphQLObjectType<unknown, { prisma: PrismaClient }>({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, args: { id: string }, context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (root, args, context) => {  
        return await context.prisma.user.findMany();
      }   
    },   
    userSubscriptions: {
      type: new GraphQLList(UserType),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, args : { id: string }, context) => {
        const result = await context.prisma.user.findUnique({
          where: {
            id: args.id,
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
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, args : { id: string }, context) => {
        return await context.prisma.profile.findUnique({
          where: {
            id: args.id
          },
        });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (root, args, context) => {
        return await context.prisma.profile.findMany();
      }
    }, 
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (root, args : { id: string }, context) => {
        return await context.prisma.memberType.findUnique({
          where: {
            id: args.id
          }
        });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (root, args, context) => {
        return await context.prisma.memberType.findMany();
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, args : { id: string }, context) => {
        return await context.prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (root, args, context) => {  
        return await context.prisma.post.findMany();
      }   
    },  
  }
});
