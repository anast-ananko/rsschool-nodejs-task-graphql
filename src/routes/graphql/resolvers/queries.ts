import { 
  GraphQLObjectType, 
  GraphQLList, 
  GraphQLNonNull 
} from 'graphql';

import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/user.js';
import { ProfileType } from '../types/profile.js';
import { PostType } from '../types/post.js';
import { MemberType } from '../types/member.js';
import { MemberTypeId } from '../types/memberTypeId.js';
import { IContext } from '../interfaces/context.js';
import { IUser } from '../interfaces/user.js';
import { IProfile } from '../interfaces/profile.js';
import { IMember } from '../interfaces/member.js';
import { IPost } from '../interfaces/post.js';

export const queries = new GraphQLObjectType<IUser, IContext>({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, { id } : IUser, context) => {
        return await context.loaders.userLoader.load(id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (root, args, context) => { 
        return await context.prisma.user.findMany();
      }   
    },   
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, { id } : IProfile, context) => {
        return await context.prisma.profile.findUnique({
          where: { id },
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
      resolve: async (root, { id } : IMember, context) => {
        return await context.prisma.memberType.findUnique({
          where: { id }
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
      resolve: async (root, { id } : IPost, context) => {
        return await context.prisma.post.findUnique({
          where: { id },
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
