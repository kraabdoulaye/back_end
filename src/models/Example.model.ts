import { Schema, model, Document } from 'mongoose';

export interface Example {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExampleDocument = Example & Document;

const exampleSchema = new Schema<Example>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ExampleModel = model<ExampleDocument>('Example', exampleSchema);
