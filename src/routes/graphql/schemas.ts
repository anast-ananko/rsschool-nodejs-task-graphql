import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType,
  GraphQLString,
  GraphQLList, 
  GraphQLFloat, 
  GraphQLSchema, 
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType
} from 'graphql';

import { UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';
import { ProfileType } from './types/profile.js';
import { PostType } from './types/post.js';
import { MemberType } from './types/member.js';
import { MemberTypeId } from './types/memberTypeId.js';
import { 
  userCreateInput,
  userChangeInput,
  profileCreateInput,
  profileChangeInput,
  postCreateInput,
  postChangeInput
} from './types/types.js';

const prisma = new PrismaClient();

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

const queries = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }) => {
        return await prisma.user.findUnique({
          where: {
            id: id,
          },
        });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {  
        return await prisma.user.findMany();
      }   
    },   
    userSubscriptions: {
      type: new GraphQLList(UserType),
      args: {
        userId: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }) => {
        const result = await prisma.user.findUnique({
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
      resolve: async (root, { id } : { id: string }) => {
        return await prisma.profile.findUnique({
          where: {
            id: id
          },
        });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async () => {
        return await prisma.profile.findMany();
      }
    }, 
    memberType: {
      type: MemberType,
      args: {
        id: { type: MemberTypeId },
      },
      resolve: async (root, { id } : { id: string }) => {
        return await prisma.memberType.findUnique({
          where: {
            id: id
          }
        });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async () => {
        return await prisma.memberType.findMany();
      }
    },
    post: {
      type: PostType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id } : { id: string }) => {
        return await prisma.post.findUnique({
          where: {
            id: id,
          },
        });
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async () => {  
        return await prisma.post.findMany();
      }   
    },  
  }
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

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  })
});

const mutations = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {   
    createUser: {
      type: UserType,
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: async (
        root,
        { dto } : { dto: userCreateInput }
      ) => {
        const newUser = await prisma.user.create({
          data: dto
        });

        return newUser;
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeUserInput },
      },
      resolve: async (root, { id, dto }: { id: string, dto: userChangeInput}) => {
        const updatedUser = await prisma.user.update({
          where: {
            id: id,
          },
          data: dto
        });

        return updatedUser;
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id }: { id: string }) => {
        try {
          await prisma.user.delete({
            where: {
              id: id,
            },
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
      resolve: async (
        root,
        { dto }: { dto: profileCreateInput }
      ) => {
        const newProfile = await prisma.profile.create({
          data: dto,
        });

        return newProfile;
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeProfileInput },
      },
      resolve: async (root, { id, dto } : { id: string, dto: profileChangeInput }) => {
        const updatedProfile = await prisma.profile.update({
          where: {
            id: id,
          },
          data: dto,
        });

        return updatedProfile;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean, 
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id }: { id: string }) => {
        try {
          await prisma.profile.delete({
            where: {
              id: id,
            },
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
      resolve: async (
        root,
        { dto }: { dto: postCreateInput }
      ) => {
        const newPost = await prisma.post.create({
          data: dto
        });

        return newPost;
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangePostInput },
      },
      resolve: async (root, { id, dto } : { id: string, dto: postChangeInput }) => {
        const updatedPost = await prisma.post.update({
          where: {
            id: id,
          },
          data: dto
        });

        return updatedPost;
      },
    },
    deletePost: {
      type: GraphQLBoolean, 
      args: {
        id: { type: UUIDType },
      },
      resolve: async (root, { id }: { id: string }) => {
        try {
          await prisma.post.delete({
            where: {
              id: id,
            },
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
      resolve: async (root, { userId, authorId }: { userId: string; authorId: string }) => {
        await prisma.subscribersOnAuthors.create({ 
          data: { 
            subscriberId: userId, 
            authorId: authorId 
          } 
        });

        return await prisma.user.findUnique({ 
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
      resolve: async (root, { userId, authorId }: { userId: string; authorId: string }) => {
        try {
          await prisma.subscribersOnAuthors.delete({ 
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

export const schema = new GraphQLSchema({
  query: queries,
  mutation: mutations,
});
