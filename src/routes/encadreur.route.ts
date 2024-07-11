import { FastifyReply } from 'fastify';
import { daoFactory } from '../core/DAO/DaoFactory';
import { EncadreurDocument, EncadreurModel } from '../models';
import EncadreurController from '../controllers/encadreur.cnt';


export default async function (fastify: any, opts: any) {
  const encadreurDao = await daoFactory<EncadreurDocument>(EncadreurModel, 'Encadreur');
  const encadreurController = new EncadreurController(encadreurDao);

  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: any, reply: any) => {
      const nom:string = request.params.nom
      const Q = await encadreurController.get(nom);
      reply.send(Q);
    },
  });

  fastify.route({
    method: 'GET',
    url: '/encadreur',
    handler: async (request: any, reply: any) => {
      const nomPre:string = request.params.encadreur
      const encadreur = await encadreurController.getEncadreur(nomPre)
      reply.send(encadreur);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          prenom: { type: 'string' },
          fonction:{type: 'string'},
          contact:{type: 'string'},
          email:{type: 'string'}
        },
        required: ['nom','prenom'],
      },
    },
    handler: async (request:any, reply:FastifyReply) => {
      try {
        const encadreur = await encadreurController.createEncadreur(request.body);
        reply.send(encadreur);
      }//ts-ignore 
      catch (error:any) {
        if(error?.status){
          console.error("message recu",error.status)
          return reply.status(error.status).send({error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement du encadreur.'});
      }
    },
  });

  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          nom:{ type: 'string' },
          prenom: { type: 'string' },
          fonction:{type: 'string'},
          contact:{type: 'string'},
          email:{type: 'string'}
        },
        required: ['nom','prenom'],
      }
    },
    url: '/:encadreurId',
    handler: async (request, reply) => {
        try {
            const encadreurId: any = request.params.serviceId;
            const updatedData = request.body;
            await encadreurController.update(encadreurId);
            const updatedEncadreur = await encadreurController.getById(encadreurId, updatedData);
            reply.status(200).send(updatedEncadreur);
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
    url: '/:encadreurId', 
    handler: async (request, reply) => {
        try {
            const encadreurId: any = request.params.encadreurId;  
            await encadreurController.delete(encadreurId);
            const Encadreur = await encadreurController.getEncadreur(encadreurId);
            reply.status(200).send(Encadreur);        
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