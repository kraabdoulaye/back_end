import { Schema, model, Document } from 'mongoose';

export interface IFilieres {
  _id?: string;
  nomfiliere: string;
  description: string;
}

export type FiliereDocument = IFilieres & Document;

const filireSchema = new Schema<IFilieres>({
  _id: Schema.Types.ObjectId,
  nomfiliere: { type: String, required: true, unique:true},
  description: { type: String, required: true},
}, {timestamps: true});

export const FiliereModel = model<FiliereDocument>('Filiere', filireSchema);