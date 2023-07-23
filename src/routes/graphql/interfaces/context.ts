import { PrismaClient } from '@prisma/client';
import { initializeDataLoaders } from '../loaders.js';

export interface IContext {
  prisma: PrismaClient,
  loaders: ReturnType<typeof initializeDataLoaders>;
}
