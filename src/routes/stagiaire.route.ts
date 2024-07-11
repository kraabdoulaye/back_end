import { FastifyReply, FastifyRequest } from 'fastify';
import { daoFactory } from '../core/DAO/DaoFactory';
import { StagiaireDocument, StagiaireModel } from '../models';
import StagiaireController from '../controllers/stagiaire.cnt';

export default async function (fastify: any, opts: any) {
  const stagiaireDao = await daoFactory<StagiaireDocument>(StagiaireModel, 'Stagiaire');
  const stagiaireController = new StagiaireController(stagiaireDao);

  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (request: any, reply: any) => {
      const stagiaire: string = request.params.Stagiaires
      const Q = await stagiaireController.get(stagiaire);
      reply.send(Q);
    },
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: async (request: any, reply: any) => {
      const { id } = request.params;
      try {
        const stagiaire = await stagiaireController.getStagiaires(id);
        reply.send(stagiaire);
      } catch (error) {
        reply.status(500).send({ error: 'Erreur lors de la récupération du stagiaire' });
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/stagiaire',
    handler: async (request: any, reply: any) => {
      const stagiaires: string = request.params.stagiaires;
      const stagiaire = await stagiaireController.getStagiaire(stagiaires)
      reply.send(stagiaire);
    },
  });


  // Route pour rechercher des stagiaires par filière
  fastify.route({
    method: 'GET',
    url: '/traite/:filiere',
    handler: async (request, reply) => {
      const filiere = (request.query as any).filiere;
      if (!filiere) {
        return reply.status(400).send({ message: 'Filière non spécifiée' });
      }

      try {
        const trainees = await stagiaireController.find({filiere});
        reply.send(trainees);
      } catch (error) {
        console.error('Erreur lors de la recherche des stagiaires', error);
        reply.status(500).send({ message: 'Erreur lors de la recherche des stagiaires' });
      }
    }
    });

  fastify.route({
    method: 'GET',
    url: '/stagiaire/cours',
    handler: async (request: any, reply: any) => {
      const stagiaires: string = request.params
      const stagiaire = await stagiaireController.getStagiaireEnCours(stagiaires)
      reply.send(stagiaire);
    },
  });

  fastify.route({
    method: 'GET',
    url: '/stagiaire/:annee',
    handler: async (request: any, reply: any) => {
      const annee: string = request.params
      const stagiaire = await stagiaireController.getStagiaire(annee)
      const annees = await stagiaireController.getStagiaireParAnnee(annee, stagiaire)
      reply.send(annee);
    },
  });


  fastify.route({
    method: 'GET',
    url: '/filiere/:nomfiliere',
    handler: async (request: any, reply: any) => {
      try {
        const { Stagiaires } = request.query;
        //const filiere = await stagiaireController.getStagiaire( Stagiaires)
        const stagiaires = await stagiaireController.rechercherStagiaire(Stagiaires);
        reply.send(stagiaires);
      } catch (error) {
        reply.status(500).send({ error: 'Erreur lors de la recherche des stagiaires' });
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/sta/:nomfiliere',
    handler: async (request: any, reply: any) => {
      try {
        const nomfiliere = request.query.nomfiliere;
        const interns = await stagiaireController.getInternByName(nomfiliere);
        return reply.send(interns);
      } catch (error) {
        return reply.status(400).send({ error })
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/service/:nomSer',
    handler: async (request: any, reply: any) => {
      try {
        const service = request.params.stagiaires;
        const stagiaires = await stagiaireController.getStagiaireService(service);
        reply.send(stagiaires);
      } catch (error) {
        reply.code(500).send({ error: 'Une erreur est survenue lors de la récupération des stagiaires par service.' });
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/sanstheme',
    handler: async (request: any, reply: any) => {
      const sanstheme: string = request.params.stagiaires
      const stagiaire = await stagiaireController.getStagiaire(sanstheme)
      const annees = await stagiaireController.getStagiaireSansTheme(sanstheme, stagiaire)
      reply.send(annees);
    },
  });

  fastify.route({
    method: 'GET',
    url: '/atheme',
    handler: async (request: any, reply: any) => {
      const atheme: string = request.params.stagiaires
      const stagiaire = await stagiaireController.getStagiaire(atheme)
      const Theme = await stagiaireController.getStagiaireATheme(atheme, stagiaire)
      reply.send(Theme);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomSta: { type: 'string' },
          prenomSta: { type: 'string' },
          dateNai: { type: 'string' },
          tel: { type: 'string' },
          email: { type: 'string' },
          nombreEnf: { type: 'number' },
          nomPrePere: { type: 'string' },
          nomPreMere: { type: 'string' },
          telParentTu: { type: 'string' },
          nomDiplome: { type: 'string' },
          nomServ: { type: 'string' },
          nomEcole: { type: 'string' },
          nomstage: { type: 'string' },
          nomfiliere: { type: 'string' },
          sm: { type: 'string' },
          dateDebut: { type: 'string' },
          dateFin: { type: 'string' },
          nomPerUrg: { type: 'string' },
          contact: { type: 'string' },
        },
        required: [
          'nomSta',
          'prenomSta',
          'dateNai',
          'tel',
          'telParentTu',
          'nomDiplome',
          'nomServ',
          'nomEcole',
          'nomstage',
          'nomfiliere',
          'sm',
          'nomPrePere',
          'nomPreMere',
          'nomPerUrg',
          'contact',
          'email'
        ],
      },
    },
    handler: async (request: any, reply: FastifyReply) => {
      try {
        const stagiaires = await stagiaireController.createStagiaire(request.body);
        reply.send(stagiaires);
      }//ts-ignore 
      catch (error: any) {
        if (error?.status) {
          console.error("message recu", error.status)
          return reply.status(error.status).send({ error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement du stagiaire.' });
      }
    },
  });

  fastify.route({
    method: 'POST',
    url: '/encadreur',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomEncadreur: { type: 'string' },
        },
        required: [
          'nomEncadreur',
        ],
      },
    },
    handler: async (request: any, reply: FastifyReply) => {
      try {
        const stagiaires = await stagiaireController.createStagiaire(request.body);
        reply.send(stagiaires);
      }//ts-ignore 
      catch (error: any) {
        if (error?.status) {
          console.error("message recu", error.status)
          return reply.status(error.status).send({ error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement du stagiaire.' });
      }
    },
  });

  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomSta: { type: 'string' },
          prenomSta: { type: 'string' },
          dateNai: { type: 'string' },
          email: { type: 'string' },
          nombreEnf: { type: 'number' },
          nomPrePere: { type: 'string' },
          nomPreMere: { type: 'string' },
          dateDebut: { type: 'string' },
          dateFin: { type: 'string' },
          tel: { type: 'string' },
          telParentTu: { type: 'string' },
          diplome: { type: 'string' },
          service: { type: 'string' },
          ecole: { type: 'string' },
          stage: { type: 'string' },
          filiere: { type: 'string' },
          sm: { type: 'string' },
          nomPerUrg: { type: 'string' },
          contact: { type: 'string' },
        },
        // required: [
        //   'nomSta',
        //   'prenomSta',
        //   'dateNai',
        //   'tel',
        //   'telParentTu',
        //   'diplome',
        //   'service',
        //   'ecole',
        //   'stage',
        //   'filiere',
        //   'sm',
        //   'nomPrePere',  
        //   'nomPreMere',
        //   'nomPerUrg',
        //   'contact',
        //   'email'
        // ],
      },
    },
    url: '/:stagiaireId',
    handler: async (request, reply) => {
      try {
        const stagiaireId: any = request.params.stagiaireId;
        const updatedData: any = request.body;
        const response = await stagiaireController.update(stagiaireId, updatedData);
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
    url: '/:stagiaireId',
    handler: async (request, reply) => {
      try {
        const stagiaireId: any = request.params.stagiaireId;
        await stagiaireController.deleteStagiaire(stagiaireId);
        const stagiaire = await stagiaireController.getStagiaire(stagiaireId);
        reply.status(200).send(stagiaire);
      }//@ts-ignore
      catch (error: Error) {
        console.error(error.message);
        request.log.debug(error);
        reply.status(500).send('Une erreur inattendue est survenue');
      }
    }
  });

  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomSta: { type: 'string' },
          prenomSta: { type: 'string' },
          stage: { type: 'string' },
          filiere: { type: 'string' },
          diplome: { type: 'string' },
          service: { type: 'string' },
          theme: { type: 'string' },
        },

      }
    },
    url: '/theme/:id',
    handler: async (request, reply) => {
      try {
        const id: any = request.params.id;
        const updatedData: any = request.body;
        const response = await stagiaireController.updateTheme(id, updatedData);
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
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          nomSta: { type: 'string' },
          prenomSta: { type: 'string' },
          stage: { type: 'string' },
          filiere: { type: 'string' },
          diplome: { type: 'string' },
          service: { type: 'string' },
          rapport: { type: 'string' },
        },

      }
    },
    url: '/rapport/:id',
    handler: async (request, reply) => {
      try {
        const id: any = request.params.id;
        const updatedData: any = request.body;
        const response = await stagiaireController.updateRapport(id, updatedData);
        reply.status(200).send(response);
      } //@ts-ignore
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