import { Schema, model, Document } from 'mongoose';

export interface IEncadreur {
  _id?: string;
  nom: string;
  prenom: string;
  fonction: string;
  contact:string;
  email:string;
}

export type EncadreurDocument = IEncadreur & Document;

const encadreurSchema = new Schema<IEncadreur>({
  _id: Schema.Types.ObjectId,
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  fonction: { type: String},
  contact: { type: String},
  email: { type: String},
}, {timestamps: true});

export const EncadreurModel = model<EncadreurDocument>('Encadreur', encadreurSchema);