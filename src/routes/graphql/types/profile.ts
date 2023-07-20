import { 
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql';
import { PrismaClient } from '@prisma/client';

import { UUIDType } from '../types/uuid.js';
import { MemberTypeId } from './memberTypeId.js';
import { MemberType } from './member.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: MemberType,
      resolve: async({ memberTypeId } : { memberTypeId: string }, args, context: { prisma: PrismaClient }) => {
        return await context.prisma.memberType.findUnique({
          where:{
            id: memberTypeId
          }
        })
      }
    }
  })
})