import { IDao } from '../core/types/IDao';
import { UtilsHelper } from '../helper/Util.helper';
import { CustomError } from '../helper/customError';
import { DiplomeDocument, DiplomeModel, IDiplome } from '../models'



export default class DiplomeController {
    [x: string]: any;
    private readonly diplomeDao: IDao<DiplomeDocument>;

    constructor(diplomeDao: IDao<DiplomeDocument>) {
      this.diplomeDao = diplomeDao;
    }

    async create(DiplomeData: any) {
      try {
        console.log('working')
        const newDiplome = await this.diplomeDao.create(DiplomeData);
        return newDiplome;
        //@ts-ignore
      } catch (error: Error) {
        if (error.code === 11000 || error.code === 11001) {
          throw new CustomError(``, 409);
        }
      }
    }

    async getDiplomes(nom: string){
      try {
        const data = await this.diplomeDao.getById(nom );
        return data;
      } catch (error) {
        throw new Error('Erreur lors de la récupération du diplôme');
      }
    }

    async getDiplome(nom:string) {
      // Obtenez les exemples depuis la base de données ou une autre source
      const data = await this.diplomeDao.find({nom});
      return data;
    }
  
    async createDiplome(payload: DiplomeDocument) {
      try {
        const nomDiplome:string = payload.nomDiplome
        const exist:any = await DiplomeModel.findOne({nomDiplome})
        if(exist) {
          return 'le Diplome avec ce nom existe déjà'
        }
        // // Générer et attribuer un nouvel ObjectId comme identifiant unique
        payload._id = UtilsHelper.generateObjectId().toString()
        const diplome:any = await this.diplomeDao.create(payload)
        return diplome;
      } catch (error) {
        return { 
          status: 500, 
          message:null ,
           data: error 
          };
      }
    }
    
    async updateDiplome(diplomeId: any, payload: any) {
      try {
        const _id:any = payload._id
        const diplome: any = await this.diplomeDao.getById(diplomeId);
        console.log(diplome);
       await this.diplomeDao.update(_id,diplome)
        return {
          status: 200,
          message: 'Modification effectuée avec succès'
        }
        //@ts-ignore
      } catch (error: Error) {
        if (error.code === 11000 || error.code === 11001)  throw new CustomError(``, 409);
        if (error.hasOwnProperty('status')) throw new CustomError(error.message, error.status);
        throw new CustomError(error.message, 500)
      }
    }
    async update(_id:string, payload: DiplomeDocument) {
      try {
        // Récuperer l'identifiant unique pour lenregistrement en cours
        const diplome: any = await this.diplomeDao.getById(_id);
        const q:any = await this.diplomeDao.update(diplome, payload)
        return q;
      } catch (error) {
        return { status: 500, message: null, data: error };
      }
    }

    async deleteDiplome(_id:string) {
      const exist:any = await this.diplomeDao.getById(_id)

      if(exist) {
        const data = await this.diplomeDao.delete(_id);
        return data
      } else {
        return "Objet introuvable"
      }
    }

  }