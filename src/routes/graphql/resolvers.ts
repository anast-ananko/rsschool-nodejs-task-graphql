import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();  

export const resolvers = {
  getAllUsers: () => prisma.user.findMany(),
};