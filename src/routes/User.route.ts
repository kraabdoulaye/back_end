import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserController } from '../controllers';
import { daoFactory } from '../core/DAO/DaoFactory';
import { UserDocument, UserModel } from '../models';
import { verifyTokenMiddleware } from '../controllers/User.cnt';
import { JwtHelper } from '../helper/jwt.helper';

const jwtHelper = new JwtHelper();

export default async function (userApp: FastifyInstance, opts: any) {
  const userDao = await daoFactory<UserDocument>(UserModel, 'user');
  const userController = new UserController(userDao, "P@ssword0");

  userApp.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          prenom: { type: 'string' },
          fonction: { type: 'string' },
          login: { type: 'string' },
          role: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['nom', 'prenom', 'fonction', 'role', 'login', 'email', 'password'],
      },
    },
    handler: async (request: any, reply: FastifyReply) => {
      try {
        const user = await userController.createUser(request.body);
        reply.send(user);
      }//ts-ignore 
      catch (error: any) {

        if (error?.status) {
          console.error("message recu", error.status)
          return reply.status(error.status).send({ error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de l\'inscription.' });
      }
    },
  });

  userApp.route({
    method: 'PUT',
    url: '/user/:id',
    schema: {
      body: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          prenom: { type: 'string' },
          fonction: { type: 'string' },
          login: { type: 'string' },
          role: { type: 'string' },
          email: { type: 'string' },
        },
        required: ['nom', 'prenom', 'fonction', 'role', 'login', 'email'],
      },
    },
    handler: async (request: any, reply: FastifyReply) => {
      try {
        const id: any = request.params.id;
        const updatedData:any = request.body;
       const response = await userController.updateUsers(id, updatedData);
        reply.status(200).send(response);
    } //@ts-ignore
    catch (error: Error) {
        console.error(error.message);
        request.log.debug(error);
        reply.status(500).send('Une erreur inattendue est survenue');
    }
    },
  });

  userApp.route({
    method: 'POST',
    url: '/auth',
    schema: {
      body: {
        type: 'object',
        properties: {
          login: { type: 'string' },
          password: { type: 'string' },
        },
        required: [
          'password',
          'login'
        ]
      }
    },
    handler: async (request: any, reply) => {
      try {
        const { login, password } = request.body
        let response = await userController.login({
          login, password
        })
        reply.status(response.status).send(response)
      } catch (error: any) {
        return reply.status(error.status).send(error.message)
      }
    }
  })

  userApp.route({
    method: 'POST',
    url: '/login',
    schema: {
      body: {
        type: 'object',
        properties: {
          login: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['login', 'password'],
      },
    },
    handler: async (request: any, reply: FastifyReply) => {
      try {
        const { login, password } = request.body;
        const user = await userController.authenticateUser(login, password);
        if (user) {
          reply.send({ message: 'Connexion réussie !', user });
        } else {
          reply.status(401).send({ error: 'Identifiants incorrects.' });
        }
       
      }//@ts-ignore 
      catch (error: any) {
        if (error?.status) {
          return reply.status(error.status).send({ error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de la connexion.' });
      }
    },
  });

  userApp.route({
    method: 'POST',
    url: '/logins',
    schema: {
      body: {
        type: 'object',
        properties: {
          login: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['login', 'password'],
      },
    },
    handler: async (request: any, reply: any) => {
      try {
        const { login, password } = request.body;
        const user: any = await userController.updatePasswordUser(login, password);
        if (user) {
          reply.send({ message: 'Connexion réussie !', user });
        } else {
          reply.status(401).send({ error: 'Identifiants incorrects.' });
        }
      }//@ts-ignore 
      catch (error: any) {
        if (error?.status) {
          return reply.status(error.status).send({ error: error.message });
        }
        return reply.status(500).send({ error: 'Une erreur est survenue lors de la connexion.' });
      }
    },
  });

  userApp.route({
    method: 'GET',
    url: '/',
    preHandler: async (request, reply) => {
      try {
        request['user'] = new JwtHelper().authenticate(request);
      } catch (error) {
        console.error(error)
        reply.code(401).send({ error: 'Non autorisé' });
      }
    },
    handler: async (request: any, reply: FastifyReply) => {
      try {
        const userId = request.user;
        const user = await userController.getInfo(userId.id);
        if (user) {
          reply.send({ message: 'info utilisateur connecté !', user });
        } else {
          reply.status(401).send({ error: 'Identifiants incorrects.' });
        }
      }//@ts-ignore 
      catch (error: Error) {
        console.log(error.message)
        reply.status(500).send({ error: 'Une erreur est survenue lors de la connexion.' });
      }
    },
  });


  userApp.route({
    method: 'GET',
    url: '/users',
    handler: async (request: any, reply: any) => {
      const nom: string = request.params.user
      const users = await userController.getUsers(nom)
      reply.send(users);
    },
  });

  // userApp.route({
  //   method: 'GET',
  //   url: '/:userId',
  //   handler: async (request: any, reply: any) => {
  //     const nom: string = request.params.user
  //     const users = await userController.getUsers(nom)
  //     reply.send(users);
  //   },
  // });

  userApp.route({
    method: 'GET',
    url: '/:id',
    handler: async (request: any, reply: any) => {
      const { id } = request.params;
      try {
        const user = await userController.getUser(id);
        reply.send(user);
      } catch (error) {
        reply.status(500).send({ error: 'Erreur lors de la récupération du diplôme' });
      }
    },
  });

  userApp.route({
    method: 'PUT',
    schema: {
      body: {
        type: 'object',
        properties: {
          oldpassword: { type: 'string' },
          password: { type: 'string' },
        },
        // required: [
        //   'password',
        //   'oldpassword'
        // ]
      }
    },
    url: '/:userId',
    handler: async (request: any, reply: any) => {
      try {
        const userId: any = request.params.userId;
        const payload:string = request.body;
        const response: any = await userController.updatePasswordUser(userId, payload);
        reply.status(response.status).send(response.message);
      }//@ts-ignore
      catch (error: Error) {
        console.error(error);
        request.log.debug(error);
        if (error.hasOwnProperty('status')) reply.status(error.status).send(error.message);
        reply.status(500).send('Une erreur est survenue');
      }
    }
  });


  userApp.route({
    method: 'DELETE',
    url: '/:userId',
    handler: async (request: any, reply: any) => {
      try {
        const userId: any = request.params.userId;
        await userController.deleteUser(userId);
        const user = await userController.getUsers(userId);
        reply.status(200).send(user);
      }//@ts-ignore
      catch (error: Error) {
        console.error(error.message);
        request.log.debug(error);
        reply.status(500).send('Une erreur inattendue est survenue');
      }
    }
  });

  userApp.route({
    method: 'GET',
    url: '/auth',
    preValidation: [verifyTokenMiddleware],
    handler: async (request: any, reply: any) => {
      try {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
          reply.code(401).send('Token manquant');
        } else {
          const jwtHelper = new JwtHelper();
          const payload = jwtHelper.verifyToken(token);

          // Utilisez le payload du token pour récupérer les informations de l'utilisateur
          const user = await userDao.getById(payload.id);

          if (!user) {
            reply.code(404).send('Utilisateur introuvable');
          } else {
            reply.send(user); // Envoie les informations de l'utilisateur en réponse
          }
        }
      } catch (error: any) {
        reply.code(401).send(error.message);
      }
    },
  });
  // Ajouter d'autres routes si nécessaire
}
