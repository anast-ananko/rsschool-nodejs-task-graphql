import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './schemas.js';
import { resolvers } from './resolvers.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const response = await graphql({
        schema: schema,
        source: req.body.query,
        // rootValue: {
        //   getAllUsers: () => fastify.prisma.user.findMany(),
        // },
        variableValues: req.body.variables,        
      })
      return response;
    },
  });
};

export default plugin;
