import { IDao } from '../core/types/IDao';
import { UtilsHelper } from '../helper/Util.helper';
import { CustomError } from '../helper/customError';
import { ThemeDocument, ThemeModel, ITheme } from '../models'



export default class ThemeController {
    [x: string]: any;
    private readonly themeDao: IDao<ThemeDocument>;

    constructor(themeDao: IDao<ThemeDocument>) {
      this.themeDao = themeDao;
    }

    async getThemes(id: string){
      try {
        const data = await this.themeDao.getById(id );
        return data;
      } catch (error) {
        throw new Error('Erreur lors de la récupération du theme');
      }
    }

    async getTheme(nom:string) {
      // Obtenez les exemples depuis la base de données ou une autre source
      const data = await this.themeDao.find({nom});
      return data;
    }
  
    async createTheme(payload: ThemeDocument) {
      try {
        const theme:string = payload.theme
        const exist:any = await ThemeModel.findOne({theme})
        if(exist) {
          return 'le theme avec ce nom existe déjà'
        }
        // // Générer et attribuer un nouvel ObjectId comme identifiant unique
        payload._id = UtilsHelper.generateObjectId().toString()
        const themes:any = await this.themeDao.create(payload)
        return themes;
      } catch (error) {
        return { 
          status: 500, 
          message:null ,
           data: error 
          };
      }
    }
    
    async updateTheme(Id: any, payload: any) {
      try {
        const _id:any = payload._id
        const theme: any = await this.diplomeDao.getById(Id);
        console.log(theme);
       await this.themeDao.update(_id,theme)
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
    async update(_id:string, payload: ThemeDocument) {
      try {
        // Récuperer l'identifiant unique pour lenregistrement en cours
        const theme: any = await this.themeDao.getById(_id);
        const q:any = await this.themeDao.update(theme, payload)
        return q;
      } catch (error) {
        return { status: 500, message: null, data: error };
      }
    }

    async deleteTheme(_id:string) {
      const exist:any = await this.themeDao.getById(_id)

      if(exist) {
        const data = await this.themeDao.delete(_id);
        return data
      } else {
        return "Objet introuvable"
      }
    }

  }