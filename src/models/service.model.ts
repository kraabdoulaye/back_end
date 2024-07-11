import { Schema, model, Document } from 'mongoose';

export interface IService {
  _id?: string;
  nomServ: string;
  chefServ: string;
}

export type ServiceDocument = IService & Document;

const serviceSchema = new Schema<IService>({
  _id: Schema.Types.ObjectId,
  nomServ: { type: String, required: true,unique:true },
  chefServ: { type: String, required: true, unique:true},
}, {timestamps: true});

export const ServiceModel = model<ServiceDocument>('Service', serviceSchema);