import { IDao } from '../core/types/IDao';
import { UtilsHelper } from '../helper/Util.helper';
import { CustomError } from '../helper/customError';
import { EncadreurDocument, EncadreurModel, IEncadreur } from '../models';


export default class EncadreurController {
    [x: string]: any;
    private readonly encadreurDao: IDao<EncadreurDocument>;

    constructor(encadreurDao: IDao<EncadreurDocument>) {
      this.encadreurDao = encadreurDao;
    }

    async create(EncadreurData) {
      try {
        console.log('working')
        const newEncadreur = await this.encadreurDao.create(EncadreurData);
        return newEncadreur;
        //@ts-ignore
      } catch (error: Error) {
        if (error.code === 11000 || error.code === 11001) {
          throw new CustomError(``, 409);
        }
      }
    }

    async getEncadreur(nomPre:string) {
      // Obtenez les exemples depuis la base de données ou une autre source
      const data = await this.encadreurDao.find({nomPre});
      return data;
    }
  
    async createEncadreur(payload: EncadreurDocument) {
      try {
        const nom:string = payload.id
        const exist:any = await EncadreurModel.findOne({nom})
        if(exist) {
          return 'le encadreur avec ce nom existe déjà'
        }
        // // Générer et attribuer un nouvel ObjectId comme identifiant unique
        payload._id = UtilsHelper.generateObjectId().toString()
        const encadreur:any = await this.encadreurDao.create(payload)
        return encadreur;
      } catch (error) {
        return { 
          status: 500, 
          message:null ,
           data: error 
          };
      }
    }
    
    async updateEncadreur(encadreurId: any, payload: any) {
      try {
        const encadreur: any = await this.serviceDao.getById(encadreurId);
        console.log(encadreur);
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
    async update(payload: EncadreurDocument) {
      try {
        // Récuperer l'identifiant unique pour lenregistrement en cours
        const _id:string = payload._id
        const q:any = await this.encadreurDao.update(_id, payload)
        return q;
      } catch (error) {
        return { status: 500, message: null, data: error };
      }
    }

    async delete(_id:string) {
      const exist:any = await this.encadreurDao.getById(_id)

      if(exist) {
        const data = await this.encadreurDao.delete(_id);

        return data
      } else {
        return "Objet introuvable"
      }
    }

  }