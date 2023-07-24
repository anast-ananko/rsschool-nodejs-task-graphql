import { GraphQLObjectType, GraphQLBoolean, GraphQLNonNull } from 'graphql';

import { UUIDType } from '../types/uuid.js';
import { IPost } from '../interfaces/post.js';
import { IUser } from '../interfaces/user.js';
import { UserType, CreateUserInput, ChangeUserInput } from '../types/user.js';
import { ProfileType, CreateProfileInput, ChangeProfileInput } from '../types/profile.js';
import { PostType, CreatePostInput, ChangePostInput } from '../types/post.js';
import { IContext } from '../interfaces/context.js';
import { 
  userCreateInput,
  userChangeInput,
  profileCreateInput,
  profileChangeInput,
  postCreateInput,
  postChangeInput
} from '../types/types.js';
import { IProfile } from '../interfaces/profile.js';

export const mutations = new GraphQLObjectType<unknown, IContext>({
  name: 'RootMutationType',
  fields: {   
    createUser: {
      type: UserType,
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: async (root, { dto } : { dto: userCreateInput }, context) => {
        const newUser = await context.prisma.user.create({
          data: dto
        });

        return newUser;
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeUserInput },
      },
      resolve: async (root, { id, dto } : { id: string, dto: userChangeInput}, context) => {
        const updatedUser = await context.prisma.user.update({
          where: { id },
          data: dto
        });

        return updatedUser;
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, { id } : IUser, context) => {
        try {
          await context.prisma.user.delete({
            where: { id },
          });
    
          return true; 
        } catch (error) {
          return false; 
        }
      },
    },   
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: CreateProfileInput },
      },
      resolve: async (root, { dto } : { dto: profileCreateInput }, context) => {
        const newProfile = await context.prisma.profile.create({
          data: dto,
        });

        return newProfile;
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeProfileInput },
      },
      resolve: async (root, { id, dto } : { id: string, dto: profileChangeInput }, context) => {
        const updatedProfile = await context.prisma.profile.update({
          where: { id },
          data: dto,
        });

        return updatedProfile;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean, 
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, { id } : IProfile, context) => {
        try {
          await context.prisma.profile.delete({
            where: { id },
          });
    
          return true; 
        } catch (error) {
          return false; 
        }
      },
    },
    createPost: {
      type: PostType,
      args: {
        dto: { type: CreatePostInput },
      },
      resolve: async (root, { dto } : { dto: postCreateInput }, context) => {
        const newPost = await context.prisma.post.create({
          data: dto
        });

        return newPost;
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangePostInput },
      },
      resolve: async (root, { id, dto } : { id: string, dto: postChangeInput }, context) => {
        const updatedPost = await context.prisma.post.update({
          where: { id },
          data: dto
        });

        return updatedPost;
      },
    },
    deletePost: {
      type: GraphQLBoolean, 
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, { id } : IPost, context) => {
        try {
          await context.prisma.post.delete({
            where: { id },
          });
    
          return true; 
        } catch (error) {
          return false; 
        }
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: {type: new GraphQLNonNull(UUIDType)}
      },
      resolve: async (root, { userId, authorId } : { userId: string; authorId: string }, context) => {
        await context.prisma.subscribersOnAuthors.create({ 
          data: { 
            subscriberId: userId, 
            authorId: authorId 
          } 
        });

        return await context.prisma.user.findUnique({ 
          where: { id: userId } 
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (root, { userId, authorId } : { userId: string; authorId: string }, context) => {
        try {
          await context.prisma.subscribersOnAuthors.delete({ 
            where: {
              subscriberId_authorId: { 
                subscriberId: userId, 
                authorId: authorId 
              } 
            } 
          });

          return true;
        } catch (error) {
          return false;
        }
      },
    },
  },
});
