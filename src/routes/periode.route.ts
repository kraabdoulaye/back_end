import { FastifyReply } from 'fastify';
import PeriodeController from '../controllers/periode.cnt';
import { daoFactory } from '../core/DAO/DaoFactory';
import { PeriodeDocument, PeriodeModel } from '../models';

export default async function (fastify: any, opts: any) {
  const periodeDao = await daoFactory<PeriodeDocument>(PeriodeModel, 'Periode');
  const periodeController = new PeriodeController(periodeDao);

  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: any, reply: any) => {
      const Q = await periodeController.get();
      reply.send(Q);
    },
  });

  fastify.route({
    method: 'GET',
    url: '/periode',
    handler: async (request: any, reply: any) => {
      const parent:string = request.params.parent
      const Q = await periodeController.getPeriode(parent)
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
          annee: { type: 'string'},
        },
        required: ['annee'],
      },
    },
    handler: async (request: any, reply: FastifyReply) => {
      try {
        const periode = await periodeController.createPeriode(request.body);
        reply.send(periode);
      }//ts-ignore 
      catch (error:any) {
        if(error?.status){
          console.error("message recu",error.status)
          return reply.status(error.status).send({ error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement annee.' });
      }
    },
  });

  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          annee: { type: 'string' },
        },
        required: ['annee'],
      }
    },
    url: '/:anneeId',
    handler: async (request, reply) => {
        try {
            const anneeId: any = request.params.anneeId;
            const updatedData = request.body;
            await periodeController.update(anneeId);
            const updatedPeriode = await periodeController.getById(anneeId, updatedData);
            reply.status(200).send(updatedPeriode);
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
    url: '/:anneeId', 
    handler: async (request, reply) => {
        try {
            const anneeId: any = request.params.anneeId;  
            await periodeController.deletePeriode(anneeId);
            const Annee = await periodeController.getPeriode(anneeId);
            reply.status(200).send(Annee);        
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