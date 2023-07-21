import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import { schema } from './schemas.js';
import { PrismaClient } from '@prisma/client';
import depthLimit from 'graphql-depth-limit';

const prisma = new PrismaClient();  

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
      const validationResult = validate(schema, parse(req.body.query), [depthLimit(5)]);
      if (validationResult && validationResult.length > 0) {
        return { data: null, errors: validationResult };
      }

      const response = await graphql({
        schema: schema,
        source: req.body.query,
        contextValue: { prisma },
        variableValues: req.body.variables,        
      })
      return response;
    },
  });
};

export default plugin;
