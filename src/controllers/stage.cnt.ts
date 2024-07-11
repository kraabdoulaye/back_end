import { IDao } from '../core/types/IDao';
import { UtilsHelper } from '../helper/Util.helper';
import { CustomError } from '../helper/customError';
import { StageDocument, StageModel, IStage } from '../models'

export default class StageController {
  [x: string]: any;
  private readonly stageDao: IDao<StageDocument>;

  constructor(stageDao: IDao<StageDocument>) {
    this.stageDao = stageDao;
  }

  async create(stageData: any) {
    try {
      console.log('working')
      const newStage = await this.stageDao.create(stageData);
      return newStage;
      //@ts-ignore
    } catch (error: Error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new CustomError(``, 409);
      }
    }
  }
  // Récupérer toutes les stages
  async getAllStage(request: any, reply: any) {
    try {
      // Utilisez la méthode de modèle pour obtenir toutes les stages depuis la base de données
      const stages = await this.StageModel.find();
      return reply.send(stages);
    } catch (error) {
      reply.status(500).send({ error:'Erreur lors de la récupération des stages'});
    }
  }

  async getStage(parent: string) {
    // Obtenez les exemples depuis la base de données ou une autre source
    const data = await this.stageDao.find({});
    return data;
  }

  async getStages(id: string){
    try {
      const data = await this.stageDao.getById(id );
      return data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de stage');
    }
  }

  async createStage(payload: StageDocument) {
    try {
      const nomstage:string = payload.nomstage
      const exist:any = await StageModel.findOne({nomstage})
      if(exist) {
        return 'stage avec ce nom existe déjà'
      }
      // // Générer et attribuer un nouvel ObjectId comme identifiant unique
      payload._id = UtilsHelper.generateObjectId().toString()
      const stage:any = await this.stageDao.create(payload)
      return stage;
    } catch (error) {
      return { 
        status: 500, 
        message:null ,
         data: error 
        };
    }
  }

  async updateStage(stageId: any, payload: any) {
    try {
      const stage: any = await this.stageDao.getById(stageId);
      console.log(stage);
      await stage.updateStage(payload.nom)
      return {
        status: 200,
        message: 'le nom du stage est modifié'
      }
      //@ts-ignore
    } catch (error: Error) {
      if (error.code === 11000 || error.code === 11001) throw new CustomError(``, 409);
      if (error.hasOwnProperty('status')) throw new CustomError(error.message, error.status);
      throw new CustomError(error.message, 500)
    }
  }
  async update(payload: StageDocument) {
    try {
      // Récuperer l'identifiant unique pour lenregistrement en cours
      const _id: string = payload._id
      const q: any = await this.stageDao.update(_id, payload)
      return q;
    } catch (error) {
      return { status: 500, message: null, data: error };
    }
  }

  async delete(_id: string) {
    const exist: any = await this.stageDao.getById(_id)
    if (exist) {
      const data = await this.stageDao.delete(_id);
      return data
    } else {
      return "Objet introuvable"
    }
  }

  async deleteStage(stageId: any) {
    try {
      console.log('working delete')
      await this.stageDao.delete(stageId);
      //@ts-ignore
    } catch (error: Error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new CustomError(``, 409);
      }
    }
  }
}