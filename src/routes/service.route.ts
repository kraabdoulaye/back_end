import { FastifyReply } from 'fastify';
import { daoFactory } from '../core/DAO/DaoFactory';
import { ServiceDocument, ServiceModel } from '../models';
import ServiceController from '../controllers/service.cnt';


export default async function (fastify: any, opts: any) {
  const serviceDao = await daoFactory<ServiceDocument>(ServiceModel, 'Service');
  const serviceController = new ServiceController(serviceDao);

  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: any, reply: any) => {
      const nomServ:string = request.params.nomServ
      const Q = await serviceController.get(nomServ);
      reply.send(Q);
    },
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: async (request: any, reply: any) => {
      const { id } = request.params;
      try {
        const service = await serviceController.getServices(id);
        reply.send(service);
      } catch (error) {
        reply.status(500).send({ error: 'Erreur lors de la récupération du service' });
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/service',
    handler: async (request: any, reply: any) => {
      const nom:string = request.params.service
      const service = await serviceController.getService(nom)
      reply.send(service);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomServ: { type: 'string' },
          chefServ:{type: 'string'}
        },
        required: ['nomServ','chefServ'],
      },
    },
    handler: async (request:any, reply:FastifyReply) => {
      try {
        const service = await serviceController.createService(request.body);
        reply.send(service);
      }//ts-ignore 
      catch (error:any) {
        if(error?.status){
          console.error("message recu",error.status)
          return reply.status(error.status).send({error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement du service.'});
      }
    },
  });

  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomServ: { type: 'string' },
          chefServ:{type: 'string'}
        },
      }
    },
    url: '/:serviceId',
    handler: async (request, reply) => {
      try {
          const serviceId = request.params.serviceId;
          const updatedData = request.body;

          const updatedService = await serviceController.updateService(serviceId, updatedData);
          reply.status(200).send(updatedService);
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
    url: '/:serviceId', 
    handler: async (request, reply) => {
        try {
            const serviceId: any = request.params.serviceId;  
            await serviceController.delete(serviceId);
            const Service = await serviceController.getService(serviceId);
            reply.status(200).send(Service);        
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