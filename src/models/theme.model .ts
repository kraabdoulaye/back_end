import { Schema, model, Document } from 'mongoose';

export interface ITheme {
  _id?: string;
  theme: string;
}

export type ThemeDocument = ITheme & Document;

const themeSchema = new Schema<ITheme>({
  _id: Schema.Types.ObjectId,
  theme: { type: String, required: true, unique:true },
}, {timestamps: true});

export const ThemeModel = model<ThemeDocument>('Theme', themeSchema);