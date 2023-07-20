import { 
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { UUIDType } from '../types/uuid.js';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});