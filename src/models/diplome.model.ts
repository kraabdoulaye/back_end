import { Schema, model, Document } from 'mongoose';

export interface IDiplome {
  _id?: string;
  nomDiplome: string;
}

export type DiplomeDocument = IDiplome & Document;

const diplomeSchema = new Schema<IDiplome>({
  _id: Schema.Types.ObjectId,
  nomDiplome: { type: String, required: true,unique:true},
});

export const DiplomeModel = model<DiplomeDocument>('Diplome', diplomeSchema);