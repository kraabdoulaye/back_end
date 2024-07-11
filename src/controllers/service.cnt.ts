import { FastifyReply, FastifyRequest } from 'fastify';
import { IDao } from '../core/types/IDao';
import { UtilsHelper } from '../helper/Util.helper';
import { CustomError } from '../helper/customError';
import { ServiceDocument, ServiceModel, IService } from '../models';


export default class ServiceController {
    [x: string]: any;
    private readonly serviceDao: IDao<ServiceDocument>;

    constructor(serviceDao: IDao<ServiceDocument>) {
      this.serviceDao = serviceDao;
    }

    async create(ServiceData: any) {
      try {
        console.log('working')
        ServiceData._id = UtilsHelper.generateObjectId().toString()
        const newService = await this.serviceDao.create(ServiceData);
        return newService;
        //@ts-ignore
      } catch (error: Error) {
        if (error.code === 11000 || error.code === 11001) {
          throw new CustomError(``, 409);
        }
      }
    }

    async getServices(id: string){
      try {
        const data = await this.serviceDao.getById(id );
        return data;
      } catch (error) {
        throw new Error('Erreur lors de la récupération de service');
      }
    }

    async getService(service:string) {
      // Obtenez les exemples depuis la base de données ou une autre source
      const data = await this.serviceDao.find({service});
      return data;
    }
  
    async createService(payload: ServiceDocument) {
      try {
        const nomServ:string = payload.id
        const exist:any = await ServiceModel.findOne({nomServ})
        if(exist) {
          return 'le service avec ce nom existe déjà'
        }
        // // Générer et attribuer un nouvel ObjectId comme identifiant unique
        payload._id = UtilsHelper.generateObjectId().toString()
        const service:any = await this.serviceDao.create(payload)
        return service;
      } catch (error) {
        return { 
          status: 500, 
          message:null ,
           data: error 
          };
      }
    }
    
    async updateService(_id:string, payload: ServiceDocument) {
      try {
        // Récuperer l'identifiant unique pour lenregistrement en cours
        const Service: any = await this.serviceDao.getById(_id);
        const q:any = await this.serviceDao.update(Service, payload)
        return q;
        //@ts-ignore
      } catch (error: Error) {
        if (error.code === 11000 || error.code === 11001)  throw new CustomError(``, 409);
        if (error.hasOwnProperty('status')) throw new CustomError(error.message, error.status);
        throw new CustomError(error.message, 500)
      }
    }

    async delete(_id:string) {
      const exist:any = await this.serviceDao.getById(_id)

      if(exist) {
        const data = await this.serviceDao.delete(_id);

        return data
      } else {
        return "Objet introuvable"
      }
    }

  }