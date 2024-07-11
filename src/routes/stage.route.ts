import { FastifyReply } from 'fastify';
import StageController from '../controllers/stage.cnt';
import { daoFactory } from '../core/DAO/DaoFactory';
import { StageDocument, StageModel } from '../models';

export default async function (fastify: any, opts: any) {
  const stageDao = await daoFactory<StageDocument>(StageModel, 'Stage');
  const stageController = new StageController(stageDao);

  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: any, reply: any) => {
      const Q = await stageController.get();
      reply.send(Q);
    },
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: async (request: any, reply: any) => {
      const { id } = request.params;
      try {
        const stage = await stageController.getStages(id);
        reply.send(stage);
      } catch (error) {
        reply.status(500).send({ error: 'Erreur lors de la récupération du stage' });
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/stage',
    handler: async (request: any, reply: any) => {
      const parent:string = request.params.parent
      const Q = await stageController.getStage(parent)
      reply.send(Q);
    },
  });
 
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomstage: { type: 'string' },
        },
        required: ['nomstage'],
      },
    },
    handler: async (request: any, reply: FastifyReply) => {
      try {
        const stage = await stageController.createStage(request.body);
        reply.send(stage);
      }//ts-ignore 
      catch (error:any) {
        if(error?.status){
          console.error("message recu",error.status)
          return reply.status(error.status).send({ error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement du stage.' });
      }
    },
  });

  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomstage: { type: 'string' },
        },
        required: ['nomstage'],
      }
    },
    url: '/:stageId',
    handler: async (request, reply) => {
        try {
            const stageId: any = request.params.stageId;
            const updatedData = request.body;
            await stageController.update(stageId);
            const updatedStage = await stageController.getById(stageId, updatedData);
            reply.status(200).send(updatedStage);
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
    url: '/:stageId', 
    handler: async (request, reply) => {
        try {
            const stageId: any = request.params.stageId;  
            await stageController.deleteStage(stageId);
            const Stage = await stageController.getStage(stageId);
            reply.status(200).send(Stage);        
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