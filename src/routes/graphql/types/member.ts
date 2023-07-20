import { 
  GraphQLObjectType,
  GraphQLInt, 
  GraphQLFloat, 
} from 'graphql';

import { MemberTypeId } from './memberTypeId.js';

export const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  })
});
