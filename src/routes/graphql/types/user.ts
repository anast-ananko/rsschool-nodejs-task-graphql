import { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLList, 
  GraphQLFloat, 
  GraphQLInputObjectType
} from 'graphql';

import { UUIDType } from '../types/uuid.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { IContext } from '../interfaces/context.js';
import { IUser } from '../interfaces/user.js';

const UserType: GraphQLObjectType = new GraphQLObjectType<IUser, IContext>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve: async ({ id }, args, context) => {
        return await context.loaders.profileLoader.load(id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }, args, context) => {
        return await context.loaders.postsLoader.load(id); 
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ userSubscribedTo }, args, context) => {
        if (userSubscribedTo) {
          return context.loaders.userLoader
            .loadMany(userSubscribedTo.map(({ authorId }) => authorId));
        }

        return null;
      }        
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ subscribedToUser }, args, context) => {
        if (subscribedToUser) {
          return context.loaders.userLoader
            .loadMany(subscribedToUser.map(({ subscriberId }) => subscriberId));
        }
        
        return null;
      }      
    }
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
