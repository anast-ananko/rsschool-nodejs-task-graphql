import { 
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInputObjectType
} from 'graphql';

import { UUIDType } from '../types/uuid.js';
import { MemberTypeId } from './memberTypeId.js';
import { MemberType } from './member.js';
import { IContext } from '../interfaces/context.js';
import { IProfile } from '../interfaces/profile.js';

const ProfileType = new GraphQLObjectType<IProfile, IContext>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: MemberType,
      resolve: async({ memberTypeId }, args, context) => {
        return context.loaders.memberLoader.load(memberTypeId);
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
