import { IDao } from '../core/types/IDao';
import { UtilsHelper } from '../helper/Util.helper';
import { CustomError } from '../helper/customError';
import { FiliereDocument, FiliereModel, IFilieres } from '../models';



export default class FiliereController {
  [x: string]: any;
  private readonly filiereDao: IDao<FiliereDocument>;

  constructor(filiereDao: IDao<FiliereDocument>) {
    this.filiereDao = filiereDao;
  }

  async createNewFiliere(FiliereData: any) {
    try {
      //console.log('working')
      FiliereData._id = UtilsHelper.generateObjectId().toString()
      const newFiieres = await this.filiereDao.create(FiliereData);
      return newFiieres;
      //@ts-ignore
    } catch (error: Error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new CustomError(``, 409);
      }
    }
  }

  async getFiliere(nomfiliere: string){
    try {
      const data = await this.filiereDao.getById(nomfiliere );
      return data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de la filiere');
    }
  }

  async getAllFiliere() {
    // Sélectionner les 20 premiers stagiaires
    const filiere = this.filiereDao.slice(0, 20);
    return filiere;
  }

  async getFilieres(Filieres: string) {
    // Obtenez les exemples depuis la base de données ou une autre source
    const data = await this.filiereDao.find({ Filieres });
    return data;
  }

  async createFiliere(filieres: FiliereDocument) {
    try {
      const nomfiliere: string = filieres.id
      const exist:any = await FiliereModel.findOne({nomfiliere})
      if (exist) {
        return 'Filiere avec ce nom existe déjà'
      }
      //Générer et attribuer un nouvel ObjectId comme identifiant unique
      filieres._id = UtilsHelper.generateObjectId().toString()
      const filiere = await this.filiereDao.create(filieres)
      return filiere;
    } catch (error) {
      return {
        status: 500,
        message: null,
        data: error
      };
    }
  }

  async update(_id:string, payload: FiliereDocument) {
    try {
      // Récuperer l'identifiant unique pour lenregistrement en cours
      const filiere: any = await this.filiereDao.getById(_id);
      const q:any = await this.filiereDao.update(filiere, payload)
      return q;
    } catch (error) {
      return { status: 500, message: null, data: error };
    }
  }

  async delete(_id: string) {
    const exist: any = await FiliereModel.findById(_id)
    if (exist) {
      const data = await this.filiereDao.delete(_id);
      return data
    } else {
      return "Objet introuvable"
    }
  }

  async deleteFiliere(id: any) {
    try {
      //console.log('working delete')
      await this.filiereDao.delete(id);
      //@ts-ignore
    } catch (error: Error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new CustomError(``, 409);
      }
    }
  }

  async updateF(_id: string, payload: FiliereDocument) {
    const exist: any = await FiliereModel.findById(_id)
    if (exist) {
      const data = await this.filieresDao.update(_id, payload);
      return data
    } else {
      return "Objet introuvable"
    }
  }
}