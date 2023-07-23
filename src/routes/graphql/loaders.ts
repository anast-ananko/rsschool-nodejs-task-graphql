import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

import { IUser } from './interfaces/user.js';
import { IPost } from './interfaces/post.js';
import { IMember } from './interfaces/member.js';

export const initializeDataLoaders = (prisma: PrismaClient) => {
  const userLoader = new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: { 
        userSubscribedTo: true, 
        subscribedToUser: true 
      },
    });

    const usersMap = new Map<string, IUser>();
    users.forEach((user) => {
      usersMap.set(user.id, user);
    });
  
    return ids.map((id) => usersMap.get(id));
  });

  const profileLoader = new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: ids as string[] },
      },
    });

    return ids.map((id) => profiles.find((profile) => profile.userId === id));
  });

  const postsLoader = new DataLoader(async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: ids as string[] },
      },
    });

    const postsMap = posts.reduce((map, post) => {
      const authorId = post.authorId;
      if (map.has(authorId)) {
        map.get(authorId)?.push(post);
      } else {
        map.set(authorId, [post]);
      }
      return map;
    }, new Map<string, IPost[]>());
  
    return ids.map((id) => postsMap.get(id) || []);
  });

  const memberLoader = new DataLoader(async (ids: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: { in: ids as string[] },
      },
    });
  
    const memberMap = new Map<string, IMember>();
    memberTypes.forEach((memberType) => {
      memberMap.set(memberType.id, memberType);
    });
  
    return ids.map((id) => memberMap.get(id) || []);
  });

  return { 
    userLoader,
    profileLoader, 
    postsLoader, 
    memberLoader
  };
}