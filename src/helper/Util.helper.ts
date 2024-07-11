import mongoose,{Schema} from "mongoose";
export class  UtilsHelper{
    public static generateObjectId():object{
        return new mongoose.Types.ObjectId();
    }
}