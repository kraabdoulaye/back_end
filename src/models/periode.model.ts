import { Schema, model, Document } from 'mongoose';

export interface IPeriode {
  _id?: string;
  annee: string;
}

export type PeriodeDocument = IPeriode & Document;

const periodeSchema = new Schema<IPeriode>({
  _id: Schema.Types.ObjectId,
  annee: { type: String, required: true },
});

export const PeriodeModel = model<PeriodeDocument>('Periode', periodeSchema);