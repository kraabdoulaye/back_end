import { FastifyReply, FastifyRequest } from 'fastify';
import { daoFactory } from '../core/DAO/DaoFactory';
import { FiliereDocument, FiliereModel } from '../models';
import FiliereController from '../controllers/Filieres.cnt';

export default async function (fastify: any, opts: any) {
  const filiereDao = await daoFactory<FiliereDocument>(FiliereModel, 'Ecole');
  const filiereController = new FiliereController(filiereDao);

  fastify.route({
    method: 'GET',
    url: '/:nomfiliere',
    handler: async (request: any, reply: any) => {
      const { nomfiliere } = request.params;
      try {
        const filiere = await filiereController.getFiliere(nomfiliere);
        reply.send(filiere);
      } catch (error) {
        reply.status(500).send({ error: 'Erreur lors de la récupération du diplôme' });
      }
    },
  });


  fastify.route({
    method: 'GET',
    url: '/filiere',
    handler: async (request: any, reply: any) => {
      const nom: string = request.params.filieres
      const filiere = await filiereController.getFilieres(nom)
      reply.send(filiere);
    },
  });


  fastify.route({
    method: 'GET',
    url: '/fil',
    handler: async (request, reply) => {
      try {
        const filiere = await filiereController.getAllFiliere();
        reply.send(filiere);
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    }
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomfiliere: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['nomfiliere', 'description'],
      },
    },
    handler: async (request: any, reply: FastifyReply) => {
      try {
        const filiere = await filiereController.createFiliere(request.body);
        reply.send(filiere);
      }//ts-ignore 
      catch (error: any) {
        if (error?.status) {
          console.error("message recu", error.status)
          return reply.status(error.status).send({ error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement filieres.' });
      }
    },
  });


  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomfiliere: { type: 'string' },
          description: { type: 'string' },
        },
      }
    },
    url: '/:filiereid',
    handler: async (request, reply) => {
      try {
        const filiereid: any = request.params.filiereid;
        const updatedData: any = request.body;
        const response = await filiereController.update(filiereid, updatedData);
        reply.status(200).send(response);
      }//@ts-ignore
      catch (error: Error) {
        console.error(error);
        request.log.debug(error);
        if (error.hasOwnProperty('status')) reply.status(error.status).send(error.message);
        reply.status(500).send('Une erreur est survenue');
      }
    }
  });

  fastify.route({
    method: 'DELETE',
    url: '/:filiereId',
    handler: async (request, reply) => {
      try {
        const filiereId: any = request.params.filiereId;
        await filiereController.delete(filiereId);
        const Filiere = await filiereController.getFilieres(filiereId);
        reply.status(200).send(Filiere);
      }//@ts-ignore
      catch (error: Error) {
        console.error(error.message);
        request.log.debug(error);
        reply.status(500).send('Une erreur inattendue est survenue');
      }
    }
  });

  // Return resolved promise explicitly.
  return Promise.resolve();
}