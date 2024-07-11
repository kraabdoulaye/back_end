import { Schema, model, Document } from 'mongoose';

export interface IStage {
  _id?: string;
  nomstage: string;
}

export type StageDocument = IStage & Document;

const stageSchema = new Schema<IStage>({
  _id: Schema.Types.ObjectId,
  nomstage: { type: String, required: true, unique:true },
}, {timestamps: true});

export const StageModel = model<StageDocument>('Stage', stageSchema);