import { Schema, model, Document } from 'mongoose';

export interface IEcole {
  _id?: string;
  nomEcole: string;
}

export type EcoleDocument = IEcole & Document;

const ecoleSchema = new Schema<IEcole>({
  _id: Schema.Types.ObjectId,
  nomEcole: { type: String, required: true, unique: true},
}, {timestamps: true});

export const EcoleModel = model<EcoleDocument>('Ecole', ecoleSchema);