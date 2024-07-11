import { IDao } from '../core/types/IDao';
import { UtilsHelper } from '../helper/Util.helper';
import { CustomError } from '../helper/customError';
import { StagiaireDocument, StagiaireModel, IStagiaire } from '../models'

export default class StagiaireController {
  [x: string]: any;
  private readonly stagiaireDao: IDao<StagiaireDocument>;
  constructor(stagiaireDao: IDao<StagiaireDocument>) {
    this.stagiaireDao = stagiaireDao;
  }

  async created(stagiaireData: StagiaireDocument) {
    try {
      //console.log('working')
      const newStagiaire = await this.stagiaireDao.create(stagiaireData);
      return newStagiaire;
      //@ts-ignore
    } catch (error: Error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new CustomError(``, 409);
      }
    }
  }
  // Récupérer tous les stagiaires
  async getAllStagiaire(request: any, reply: any) {
    try {
      // Utilisez la méthode de modèle pour obtenir tous les stagiaires depuis la base de données
      const stagiaire = await this.StagiaireModel.find();
      return reply.send(stagiaire);
    } catch (error) {
      reply.status(500).send({ error: 'Erreur lors de la récupération des stagiaires' });
    }
  }

  // recuperation des stagiaire par filiere
  async getStagiaireFiliere(request, reply) {
    try {
    const nomfiliere = request.params;
    const stagiaire = await StagiaireModel.find({ nomfiliere });
    return stagiaire
  } catch (error) {
    reply.status(500).send({ error: 'Erreur lors de la récupération des stagiaires' });
  }
  }

  // recuperation des stagiaire par service
  async getStagiaireService(nomServ: any) {
    const stagiaires = await StagiaireModel.find({ nomServ });
    return stagiaires
  }

  async getTraineesByFiliere (request:any , reply:any) {
    const filiere = (request.query as any).filiere;
    if (!filiere) {
      return reply.status(400).send({ message: 'Filière non spécifiée' });
    }
  
    try {
      const trainees = await StagiaireModel.find({ filiere });
      reply.send(trainees);
    } catch (error) {
      console.error('Erreur lors de la recherche des stagiaires', error);
      reply.status(500).send({ message: 'Erreur lors de la recherche des stagiaires' });
    }
  };

  async getStagiaireEnCours(reply: any) {
    try {
      const stagiairesEnCours = await StagiaireModel.find({
        dateDebut: { $lte:  new Date() },
        dateFin: { $gte:  new Date() },
      });

      return stagiairesEnCours;

    } catch (error) {
      reply.status(500).send('Erreur lors de la récupération des stagiaires en cours de stage.');
    }
  }

  async getStagiaireParAnnee(reply, request) {

    try {
      const { Annee } = request.params; // Supposons que l'année est passée en tant que paramètre dans l'URL
      const startDate = new Date(Annee, 0, 1); // Début de l'année
      const endDate = new Date(Annee, 11, 31); // Fin de l'année
      const stagiaires = await this.stagiaireDao.find({
        dateDebut: { $gte: startDate, $lte: endDate },
      });
      return stagiaires;
    } catch (error) {
      reply.status(500).send('Erreur lors de la récupération des stagiaires pour cette année.');
    }

  }

  async getStagiaire(stagiaire: string) {
    // Obtenez les exemples depuis la base de données ou une autre source
    const data = await this.stagiaireDao.find({ stagiaire });
    return data;
  }

  async getStagiaires(id: string) {
    try {
      const data = await this.stagiaireDao.getById(id);
      return data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération du stagiaire');
    }
  }

  async rechercherStagiaire(filiere: any | undefined) {
    try {
      const stagiaires = await this.stagiaireDao.getByCriterial({filiere});
      return stagiaires;
    } catch (error) {
      throw new Error('Erreur lors de la recherche des stagiaires');
    }
  }

  async getInternByName(nomfiliere:any){
      try{
        const Filiere = await this.stagiaireDao.getByItem(nomfiliere);
        return Filiere
      }catch (error) {}
  }

  async createStagiaire(payload: StagiaireDocument) {
    try {
      // Générer et attribuer un nouvel ObjectId comme identifiant unique
      payload._id = UtilsHelper.generateObjectId().toString()
      const stagiaire: any = await this.stagiaireDao.create(payload)
      return stagiaire;
    } catch (error) {
      return {
        status: 500,
        message: null,
        data: error
      };
    }
  }

  async updateEcole(_id: string, payload: StagiaireDocument) {
    try {
      // Récuperer l'identifiant unique pour lenregistrement en cours
      const Stagiaire: any = await this.stagiaireDao.getById(_id);
      const q: any = await this.stagiaireDao.update(Stagiaire, payload)
      return q;
      //@ts-ignore
    } catch (error: Error) {
      if (error.code === 11000 || error.code === 11001) throw new CustomError(``, 409);
      if (error.hasOwnProperty('status')) throw new CustomError(error.message, error.status);
      throw new CustomError(error.message, 500)
    }
  }

  async deleteStagiaire(_id: string) {
    const exist: any = await this.stagiaireDao.getById(_id)
    if (exist) {
      const data = await this.stagiaireDao.delete(_id);
      return data
    } else {
      return "Objet introuvable"
    }
  }

  async updateStagiaireEncadreur(stagiaireId: any, payload: any) {
    try {
      const Encadreur: any = await this.stagiaireDao.getById(stagiaireId);
      console.log(Encadreur);
      await Encadreur.updateEncadreur(payload.nomEncadreur)
      return {
        status: 200,
        message: 'nom encadreur modifié'
      }
      //@ts-ignore
    } catch (error: Error) {
      if (error.code === 11000 || error.code === 11001) throw new CustomError(``, 409);
      if (error.hasOwnProperty('status')) throw new CustomError(error.message, error.status);
      throw new CustomError(error.message, 500)
    }
  }

  async updateTheme(_id: string, payload: StagiaireDocument) {
    try {
      // Récuperer l'identifiant unique pour lenregistrement en cours
      const theme: any = await this.stagiaireDao.getById(_id);
      const q: any = await this.stagiaireDao.update(theme, payload)
      return q;
    } catch (error) {
      return { status: 500, message: null, data: error };
    }
  }

  async updateRapport(_id: string, payload: StagiaireDocument) {
    
    try {
      // Récuperer l'identifiant unique pour lenregistrement en cours
      const rapport: any = await this.stagiaireDao.getById(_id);
      const q: any = await this.stagiaireDao.update(rapport, payload)
      
      return q;
    } catch (error) {
      return { status: 500, message: null, data: error };
    }
  }

  async getStagiaireSansTheme(reply, request) {

    try {
      const stagiairesSansTheme = await this.stagiaireDao.find({ theme: { $exists: false } });
      return stagiairesSansTheme;
    } catch (error) {
      reply.status(500).send('Erreur lors de la récupération des stagiaires sans thème.');
    }
  };

  async getStagiaireATheme(reply, request) {

    try {
      const stagiairesATheme = await this.stagiaireDao.find({ theme: { $exists: true } });
      return stagiairesATheme;
    } catch (error) {
      reply.status(500).send('Erreur lors de la récupération des stagiaires avec thème.');
    }
  };

  async update(_id:string, payload: StagiaireDocument) {
    try {
      // Récuperer l'identifiant unique pour lenregistrement en cours
      const stagiaire: any = await this.stagiaireDao.getById(_id);
      const q:any = await this.stagiaireDao.update(stagiaire, payload)
      return q;
    } catch (error) {
      return { status: 500, message: null, data: error };
    }
  }
  
}