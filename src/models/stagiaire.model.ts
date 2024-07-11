import { Schema, model, Document } from 'mongoose';

export interface IStagiaire {
  _id?: string;
  nomSta: string;
  prenomSta: string;
  dateNai:string;
  tel:string;
  email:string;
  nombreEnf:number;
  nomPrePere:string;
  nomPreMere:string;
  telParentTu:string;
  dateDebut:Date;
  dateFin:Date;
  nomPerUrg:string;
  contact:string;
  theme:string;
  rapport:string;
  
  sm?: string;
  nomDiplome?:string;
  nomServ?:string;
  nomEcole?:string;
  nomstage?:string;
  nomfiliere?:string;
  nomEncadreur:string;
}

export type StagiaireDocument = IStagiaire & Document;

const stagiaireSchema = new Schema<IStagiaire>({
  _id: Schema.Types.ObjectId,
  nomSta: { type: String, required: true},
  prenomSta: { type: String, required: true},
  dateNai: { type: String, required: true},
  tel: { type: String, required: true},
  email:{ type:String, required:true},
  nombreEnf:{ type: Number, required:true },
  nomPrePere:{ type:String, required:true},
  nomPreMere:{ type: String, required:true },
  telParentTu: { type: String, required: true},
  nomDiplome: { type:String, required: true},
  nomServ: { type: String, ref:'Service', required: true},
  nomEcole: { type: String, ref:'Ecole', required: true},
  nomstage: { type: String, ref:'Stage', required: true},
  nomfiliere: { type: String, ref:'Filiere', required: true},
  nomEncadreur: { type: String, ref:'Encadreur'},
  dateDebut: { type: Date, required: true},
  dateFin: { type: Date, required: true},
  sm:{type:String, required:true, default: 'Celibataire'},
  nomPerUrg:{ type: String, required: true},
  contact:{ type:String, required: true},
  theme:{ type:String, ref:'Theme'},
  rapport:{ type:String},
});

// const date = new Date();
// const dateWithoutTime:any = date.toLocaleDateString();

// // Pré-générateur (pre-hook) pour appliquer la fonction dateWithoutTime avant de sauvegarder les données
// stagiaireSchema.pre('save', function (next) {
//   const currentStartDate = this.dateDebut;
//   const currentEndDate = this.dateFin;
//   this.dateDebut = dateWithoutTime(currentStartDate);
//   this.dateFin = dateWithoutTime(currentEndDate);
//   next();
// });

export const StagiaireModel = model<StagiaireDocument>('Stagiaire', stagiaireSchema);