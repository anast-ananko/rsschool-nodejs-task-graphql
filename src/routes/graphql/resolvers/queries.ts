import { GraphQLObjectType, GraphQLList } from 'graphql';
import { PrismaClient } from '@prisma/client';

import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.js';
import { ProfileType } from '../types/profile.js';
import { PostType } from '../types/post.js';
import { MemberType } from '../types/member.js';
import { MemberTypeId } from '../types/memberTypeId.js';

export const queries = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }, context: { prisma: PrismaClient }) => {
        return await context.prisma.user.findUnique({
          where: {
            id: id,
          },
        });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (root, args, context: { prisma: PrismaClient }) => {  
        return await context.prisma.user.findMany();
      }   
    },   
    userSubscriptions: {
      type: new GraphQLList(UserType),
      args: {
        userId: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }, context: { prisma: PrismaClient }) => {
        const result = await context.prisma.user.findUnique({
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
      resolve: async (root, { id } : { id: string }, context: { prisma: PrismaClient }) => {
        return await context.prisma.profile.findUnique({
          where: {
            id: id
          },
        });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (root, args, context: { prisma: PrismaClient }) => {
        return await context.prisma.profile.findMany();
      }
    }, 
    memberType: {
      type: MemberType,
      args: {
        id: { type: MemberTypeId },
      },
      resolve: async (root, { id } : { id: string }, context: { prisma: PrismaClient }) => {
        return await context.prisma.memberType.findUnique({
          where: {
            id: id
          }
        });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (root, args, context: { prisma: PrismaClient }) => {
        return await context.prisma.memberType.findMany();
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }, context: { prisma: PrismaClient }) => {
        return await context.prisma.post.findUnique({
          where: {
            id: id,
          },
        });
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (root, args, context: { prisma: PrismaClient }) => {  
        return await context.prisma.post.findMany();
      }   
    },  
  }
});