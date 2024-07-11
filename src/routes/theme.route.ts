import { FastifyReply } from 'fastify';
import { daoFactory } from '../core/DAO/DaoFactory';
import { ThemeDocument, ThemeModel } from '../models';
import ThemeController from '../controllers/theme.cnt ';


export default async function (fastify: any, opts: any) {
  const themeDao = await daoFactory<ThemeDocument>(ThemeModel, 'Theme');
  const themeController = new ThemeController(themeDao);

  fastify.route({
    method: 'GET',
    url: '/:nom',
    handler: async (request: any, reply: any) => {
      const { nom } = request.params;
    try {
      const theme = await themeController.getThemes(nom);
      reply.send(theme);
    } catch (error) {
      reply.status(500).send({ error: 'Erreur lors de la récupération du theme' });
    }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/theme',
    handler: async (request: any, reply: any) => {
      const parent:string = request.params.theme
      const theme = await themeController.getTheme(parent)
      reply.send(theme);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          theme: { type: 'string' },
        },
        required: ['theme'],
      },
    },
    handler: async (request:any, reply:FastifyReply) => {
      try {
        const theme = await themeController.createTheme(request.body);
        reply.send(theme);
      }//ts-ignore 
      catch (error:any) {
        if(error?.status){
          console.error("message recu",error.status)
          return reply.status(error.status).send({error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'enregistrement du theme.'});
      }
    },
  });

  fastify.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          theme: { type: 'string' },
        },
        required: ['theme'],
      }
    },
    url: '/:themeid',
    handler: async (request, reply) => {
        try {
            const themeid: any = request.params.themeid;
            const updatedData:any = request.body;
           const response = await themeController.update(themeid, updatedData);
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
    url: '/:themeid', 
    handler: async (request, reply) => {
        try {
            const themeid: any = request.params.themeid;  
            await themeController.deleteTheme(themeid);
            const theme = await themeController.getTheme(themeid);
            reply.status(200).send(theme);        
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