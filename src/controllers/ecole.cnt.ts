import { IDao } from '../core/types/IDao';
import { UtilsHelper } from '../helper/Util.helper';
import { CustomError } from '../helper/customError';
import { EcoleDocument, EcoleModel, IEcole } from '../models';


export default class EcoleController {
    get(nom: string) {
      throw new Error('Method not implemented.');
    }
    [x: string]: any;
    private readonly ecoleDao: IDao<EcoleDocument>;

    constructor(ecoleDao: IDao<EcoleDocument>) {
      this.ecoleDao = ecoleDao;
    }

    async create(EcoleData: any) {
      try {
        console.log('working')
        const newEcole = await this.ecoleDao.create(EcoleData);
        return newEcole;
        //@ts-ignore
      } catch (error: Error) {
        if (error.code === 11000 || error.code === 11001) {
          throw new CustomError(``, 409);
        }
      }
    }

    async getEcoles(id: string){
      try {
        const data = await this.ecoleDao.getById(id);
        return data;
      } catch (error) {
        throw new Error('Erreur lors de la récupération ecole');
      }
    }

    async getEcole(Ecole:string) {
      // Obtenez les exemples depuis la base de données ou une autre source
      const data = await this.ecoleDao.find({Ecole});
      return data;
    }
  
    async createEcole(payload: EcoleDocument) {
      try {
        const nomEcole:string = payload.nomEcole
        const exist:any = await EcoleModel.findOne({nomEcole})
        if(exist) {
          return 'ecole avec ce nom existe déjà'
        }
        // // Générer et attribuer un nouvel ObjectId comme identifiant unique
        payload._id = UtilsHelper.generateObjectId().toString()
        const ecole:any = await this.ecoleDao.create(payload)
        return ecole;
      } catch (error) {
        return { 
          status: 500, 
          message:null ,
           data: error 
          };
      }
    }
    
    async updateEcole(_id:string, payload: EcoleDocument) {
      try {
        // Récuperer l'identifiant unique pour lenregistrement en cours
        const Ecole: any = await this.ecoleDao.getById(_id);
        const q:any = await this.ecoleDao.update(Ecole, payload)
        return q;
        //@ts-ignore
      } catch (error: Error) {
        if (error.code === 11000 || error.code === 11001)  throw new CustomError(``, 409);
        if (error.hasOwnProperty('status')) throw new CustomError(error.message, error.status);
        throw new CustomError(error.message, 500)
      }
    }

    async delete(_id: string) {
      const exist: any = await this.ecoleDao.getById(_id)
      if (exist) {
        const data = await this.ecoleDao.delete(_id);
        return data
      } else {
        return "Objet introuvable"
      }
    }
  
    async deleteEcole(ecoleId: any) {
      try {
        //console.log('working delete')
        await this.ecoleDao.delete(ecoleId);
        //@ts-ignore
      } catch (error: Error) {
        if (error.code === 11000 || error.code === 11001) {
          throw new CustomError(``, 409);
        }
      }
    }
  }