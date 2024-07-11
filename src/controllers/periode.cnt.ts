import { IDao } from '../core/types/IDao';
import { UtilsHelper } from '../helper/Util.helper';
import { CustomError } from '../helper/customError';
import { PeriodeDocument, PeriodeModel, IPeriode } from '../models'

export default class PeriodeController {
    [x: string]: any;
    private readonly periodeDao: IDao<PeriodeDocument>;

    constructor(periodeDao: IDao<PeriodeDocument>) {
      this.periodeDao = periodeDao;
    }

    async create(PeriodeData: any) {
      try {
        console.log('working')
        const newPeriode = await this.periodeDao.create(PeriodeData);
        return newPeriode;
        //@ts-ignore
      } catch (error: Error) {
        if (error.code === 11000 || error.code === 11001) {
          throw new CustomError(``, 409);
        }
      }
    }

    async getPeriode(periode:string) {
      // Obtenez les exemples depuis la base de données ou une autre source
      const data = await this.periodeDao.find({periode});
      return data;
    }
  
    async createPeriode(payload: PeriodeDocument) {
      try {
        const periode:string = payload.id
        const exist:any = await PeriodeModel.findOne({periode})
        if(exist) {
          return 'Annee existe déjà'
        }
        // // Générer et attribuer un nouvel ObjectId comme identifiant unique
        payload._id = UtilsHelper.generateObjectId().toString()
        const annes:any = await this.periodeDao.create(payload)
        return annes;
      } catch (error) {
        return { 
          status: 500, 
          message:null ,
           data: error 
          };
      }
    }
    
    async updatePeriode(anneeId: any, payload: any) {
      try {
        const annee: any = await this.periodeDao.getById(anneeId);
        console.log(annee);
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
    async update(payload: PeriodeDocument) {
      try {
        // Récuperer l'identifiant unique pour lenregistrement en cours
        const _id:string = payload._id
        const q:any = await this.periodeDao.update(_id, payload)
        return q;
      } catch (error) {
        return { status: 500, message: null, data: error };
      }
    }

    async deletePeriode(_id:string) {
      const exist:any = await this.periodeDao.getById(_id)

      if(exist) {
        const data = await this.periodeDao.delete(_id);

        return data
      } else {
        return "Objet introuvable"
      }
    }

  }