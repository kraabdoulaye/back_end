import fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import routes from './routes';
import dotenv from 'dotenv';
import { connectDb } from './core/dbConfig'
import * as fastifyMultipart from 'fastify-multipart';
import swagger from 'fastify-swagger';

const server: FastifyInstance = fastify({ logger: true });
dotenv.config();
const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          version: { type: 'string' }
        }
      }
    }
  }
};
//cors 
const cors = require('@fastify/cors');
server.register(cors, {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,PATCH',
});

server.get(`/api${process.env.API_PATH}/container`, opts, async (request, reply) => {
  try {
    const version = process.env.npm_package_version;
    console.log(`Version: ${version}`);
    
    if (!version) {
      throw new Error('Version is undefined');
    }
    
    const response = { version };
    reply.status(200).send(response);
  } catch (error) {
    console.error(`Error in /container route: ${error}`);
    reply.status(500).send({ error: 'An error occurred' });
  }
});

const start = async () => {
  try {
    const portStr = process.env.SERVER_PORT || '8085';
    const port = parseInt(portStr, 10);
    if (isNaN(port)) {
      console.error('Invalid port number');
      process.exit(1);
    }
    await connectDb(); //établir la connexion avant l'enregistrement des routes
    server.register(fastifyMultipart, { addToBody: true });
    await server.register(require('@fastify/swagger'), {
      swagger: {
        info: {
          title: 'GestStagiaire Api\'s',
          description: 'api for geston stagiaire (client/admin)',
          version: '0.1.0'
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here'
        },
        host: '127.0.0.1:8085',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      }
    }); 
    server.register(require('@fastify/swagger-ui'), {
      routePrefix: '/docs',
      swagger: {
          info: {
              title: 'My FirstAPP Documentation',
              description: 'My FirstApp Backend Documentation description',
              version: '0.1.0',
              termsOfService: 'https://mywebsite.io/tos',
              contact: {
                  name: 'kra',
                  email: 'abdoulkra1@gmail.com'
              }
          },
          
          host: '127.0.0.1:8085',
          basePath: '',
          schemes: ['http', 'https'],
          consumes: ['application/json'],
          produces: ['application/json'],
      },
      uiConfig: {
          docExpansion: 'none', // expand/not all the documentations none|list|full
          deepLinking: true
      },
      uiHooks: {
          onRequest: function(request, reply, next) {
              next()
          },
          preHandler: function(request, reply, next) {
              next()
          }
      },
      staticCSP: false,
      transformStaticCSP: (header) => header,
      exposeRoute: true
    })
    server.register(routes, {prefix:`/api${process.env.API_PATH}`, errorHandler: false });

    server.ready()
    server.listen({ port, host: '0.0.0.0' });
    server.log.info(`Server listening on ${port}`);
  } catch (err) {
    server.log.error(err);
    
  }
};

start();