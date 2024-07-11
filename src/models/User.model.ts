import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { CustomError } from '../helper/customError';

// Définir les propriétés du modèle User dans une interface
export interface User {
  nom: string;
  prenom: string;
  fonction: string;
  login: string;
  role: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends User, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<User>({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  fonction: { type: String, required: true },
  login: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
      //@ts-ignore
    } catch (error: Error) {
      next(error);
    }
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  }//@ts-ignore 
  catch (error:Error) {
    throw error;
  }
};

UserSchema.methods.updatePassword = async function (password, oldpassword) {
  try {
    const isMatched = await this.comparePassword(oldpassword)
    if (!isMatched ) throw new CustomError('Ancien mot de passe incorrect',400)
    this.password = password;
    this.save();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Créer le modèle Mongoose à partir du schéma UserSchema
export const UserModel = model<UserDocument>('User', UserSchema);