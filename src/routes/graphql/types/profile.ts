import { 
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInputObjectType
} from 'graphql';
import { PrismaClient } from '@prisma/client';

import { UUIDType } from '../types/uuid.js';
import { MemberTypeId } from './memberTypeId.js';
import { MemberType } from './member.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProfileType = new GraphQLObjectType<any, { prisma: PrismaClient }>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: MemberType,
      resolve: async({ memberTypeId } : { memberTypeId: string }, args, context) => {
        return await context.prisma.memberType.findUnique({
          where:{
            id: memberTypeId
          }
        })
      }
    }
  })
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
  }),
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  }),
});

export { ProfileType, CreateProfileInput, ChangeProfileInput };
