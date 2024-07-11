import { FastifyReply } from 'fastify';
import { daoFactory } from '../core/DAO/DaoFactory';
import { DiplomeDocument, DiplomeModel } from '../models';
import DiplomeController from '../controllers/diplome.cnt';


export default async function (fastify: any, opts: any) {
  const diplomeDao = await daoFactory<DiplomeDocument>(DiplomeModel, 'Diplome');
  const diplomeController = new DiplomeController(diplomeDao);

  fastify.route({
    method: 'GET',
    url: '/:nomDiplome',
    handler: async (request: any, reply: any) => {
      const { nomDiplome } = request.params;
    try {
      const diplome = await diplomeController.getDiplomes(nomDiplome);
      reply.send(diplome);
    } catch (error) {
      reply.status(500).send({ error: 'Erreur lors de la récupération du diplôme' });
    }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/diplome',
    handler: async (request: any, reply: any) => {
      const parent:string = request.params.nomDiplome
      const diplome = await diplomeController.getDiplome(parent)
      reply.send(diplome);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomDiplome: { type: 'string' },
        },
        required: ['nomDiplome'],
      },
    },
    handler: async (request:any, reply:FastifyReply) => {
      try {
        const diplome = await diplomeController.createDiplome(request.body);
        reply.send(diplome);
      }//ts-ignore 
      catch (error:any) {
        if(error?.status){
          console.error("message recu",error.status)
          return reply.status(error.status).send({error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement du diplome.'});
      }
    },
  });

  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomDiplome: { type: 'string' },
        },
        required: ['nomDiplome'],
      }
    },
    url: '/:diplomeid',
    handler: async (request, reply) => {
        try {
            const diplomeid: any = request.params.diplomeid;
            const updatedData:any = request.body;
           const response = await diplomeController.update(diplomeid, updatedData);
            reply.status(200).send(response);
        } //@ts-ignore
        catch (error: Error) {
            console.error(error.message);
            request.log.debug(error);
            reply.status(500).send('Une erreur inattendue est survenue');
        }
    }
});

  fastify.route({
    method: 'DELETE',
    url: '/:diplomeId', 
    handler: async (request, reply) => {
        try {
            const diplomeId: any = request.params.diplomeId;  
            await diplomeController.deleteDiplome(diplomeId);
            const diplome = await diplomeController.getDiplome(diplomeId);
            reply.status(200).send(diplome);        
        }//@ts-ignore
         catch (error:Error) {
            console.error(error.message);
            request.log.debug(error);
            reply.status(500).send('Une erreur inattendue est survenue');
        }
    }
});
  // Return resolved promise explicitly.
  return Promise.resolve();
}