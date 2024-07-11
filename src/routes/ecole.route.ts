import { FastifyReply } from 'fastify';
import { daoFactory } from '../core/DAO/DaoFactory';
import { EcoleDocument, EcoleModel } from '../models';
import EcoleController from '../controllers/ecole.cnt';


export default async function (fastify: any, opts: any) {
  const ecoleDao = await daoFactory<EcoleDocument>(EcoleModel, 'Ecole');
  const ecoleController = new EcoleController(ecoleDao);

  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: any, reply: any) => {
      const nom:string = request.params.nomEcole
      const Q = await ecoleController.get(nom);
      reply.send(Q);
    },
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: async (request: any, reply: any) => {
      const { id } = request.params;
      try {
        const ecole = await ecoleController.getEcoles(id);
        reply.send(ecole);
      } catch (error) {
        reply.status(500).send({ error: 'Erreur lors de la récupération ecole' });
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/ecole',
    handler: async (request: any, reply: any) => {
      const nomEcole:string = request.params.ecoles
      const ecole = await ecoleController.getEcole(nomEcole)
      reply.send(ecole);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomEcole: { type: 'string'},
        },
        required: ['nomEcole'],
      },
    },
    handler: async (request:any, reply:FastifyReply) => {
      try {
        const ecole = await ecoleController.createEcole(request.body);
        reply.send(ecole);
      }//ts-ignore 
      catch (error:any) {
        if(error?.status){
          console.error("message recu",error.status)
          return reply.status(error.status).send({error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement ecole.'});
      }
    },
  });

  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomEcole: { type: 'string' },
        },
        required: ['nomEcole'],
      }
    },
    url: '/:ecoleId',
    handler: async (request, reply) => {
        try {
            const ecoleId = request.params.ecoleId;
            const updatedData:any = request.body;
            const updatedEcole = await ecoleController.updateEcole(ecoleId, updatedData);
            reply.status(200).send(updatedEcole);
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
  url: '/:ecoleId',
  handler: async (request, reply) => {
    try {
      const ecoleId: any = request.params.ecoleId;
      await ecoleController.deleteEcole(ecoleId);
      const Ecole = await ecoleController.getEcole(ecoleId);
      reply.status(200).send(Ecole);
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