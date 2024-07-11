import UserRoute from './User.route';
import ServiceRoute from './service.route';
import DiplomeRoute from './diplome.route';
import StagiaireRoute from './stagiaire.route';
import EcoleRoute from './ecole.route';
import PeriodeRoute from './periode.route';
import stageRoute from './stage.route';
import encadreurRoute from './encadreur.route';
import FilieresRoute from './Filieres.route';
import themeRoute from './theme.route';
// Import des routes

export default async function (fastify: any, opts: any, done: any) {
  fastify.register(UserRoute, { prefix: '/users' });
  fastify.register(FilieresRoute, {prefix: '/filiere'});
  fastify.register(ServiceRoute, {prefix: '/service'});
  fastify.register(DiplomeRoute, {prefix: '/diplome'});
  fastify.register(StagiaireRoute, {prefix: '/stagiaire'});
  fastify.register(EcoleRoute, {prefix: '/ecole'});
  fastify.register(PeriodeRoute, {prefix: '/periode'});
  fastify.register(stageRoute, {prefix: '/stage'});
  fastify.register(encadreurRoute, {prefix: '/encadreur'});
  fastify.register(themeRoute, {prefix: '/theme'});
  // Enregistrement des routes
  done();
}

