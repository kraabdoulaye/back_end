import { IDao } from '../core/types/IDao';
import { CustomError } from "../helper/customError";
import { UserDocument, UserModel } from '../models/User.model';
import { JwtHelper } from '../helper/jwt.helper';
import bcrypt from "bcrypt";  

export const verifyTokenMiddleware = async (request: any, reply: any) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      reply.code(401).send('Token manquant');
    } else {
      const jwtHelper = new JwtHelper();
      jwtHelper.verifyToken(token);
    }
  } catch (error: any) {
    reply.code(401).send(error.message);
  }
};

export default class UserController {

  private readonly userDao: IDao<UserDocument>;
  private readonly jwtHelper: JwtHelper;

  constructor(userDao: IDao<UserDocument>, jwtSecret: string) {
    this.userDao = userDao;
    this.jwtHelper = new JwtHelper(jwtSecret);
  }

  async createUser(userData: UserDocument): Promise<{ user: UserDocument, token: string }> {
    try {
      const existingUser: any = await this.userDao.getByCriteria({ email: userData.email });
      if (existingUser.length > 0) {
        throw { status: 400, message: 'Un utilisateur avec cet email existe déjà.' };
      }
      const existingUserLogin: any = await this.userDao.getByCriteria({ login: userData.login });
      if (existingUserLogin.length > 0) {
        throw ({ status: 400, message: 'Un utilisateur avec ce numéro existe déjà.' });
      }

      const user = await this.userDao.create(userData);
      const token = this.jwtHelper.createToken({ id: user.id });
      const registred = user?.toObject()
      delete registred.passecode
      return { user: { ...registred }, token };
    } catch (error: any) {
      throw error;
    }
  }

  async getUser(id: string){
    try {
      const data = await this.userDao.getById(id );
      return data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération user');
    }
  }

  async updatePasswordUser(userId: any, payload: any) {
    try {
      const user: any = await this.userDao.getById(userId);
      console.log(user);
      await user.updatePassword(payload.password, payload.oldpassword)
      return {
        status: 200,
        message: 'Mot de passe modifié'
      }
      //@ts-ignore
    } catch (error: Error) {
      if (error.code === 11000 || error.code === 11001)  throw new CustomError(``, 409);
      if (error.hasOwnProperty('status')) throw new CustomError(error.message, error.status);
      throw new CustomError(error.message, 500)
    }
  }

  async authenticateUser(login: string, passecode: string): Promise<{
    user: UserDocument, token: string
  } | null> {
    try {
      const users: any = await this.userDao.getByCriteria({ $or: [{ login: login }, { contact: login }] });
      console.log(users)
      if (users.length <= 0) {
        console.log("ici ")
        throw ({ status: 400, message: 'login ou mot de passe incorrect veuillez-reéssayer' });
      }

      const connected = users[0];

      if (connected && await connected.comparePassword(passecode)) {
        const token = this.jwtHelper.createToken({ id: connected.id });
        const user = connected?.toObject()
        const role = connected?.toObject()
        delete user.passecode
        return { user, token };
      }
      console.log(" la ")
      throw ({ status: 400, message: 'login ou mot de passe incorrect veuillez-reéssayer' });
    } catch (error) {
      throw error;
    }
  }

  async login(payload: { login: string; password: string }) {
    try {
      const user = await this.existLogin(payload.login)
      const isTruePwd = this.comparePwd(user.password, payload.password);
      const jwtHelper = new JwtHelper()
      let token = await jwtHelper.createToken({ id: user._id });
      const connectedUser = user.toJSON()
      delete connectedUser.password
      delete connectedUser._id
      delete connectedUser.__v
      const response = {
        ...isTruePwd,
        // status : 200,
        token,
        ...connectedUser
      }
      return response
    } catch (error: any) {
      console.log(error.message);
      return error;
    }
  }

  async existLogin(login) {
    const user: any = await this.userDao.getByCriteria({
      $or: [{ email: login }, { login: login }],
    });
    if (user.length == 0) {
      throw new CustomError("Login ou mot de passe incorrect", 400);
    }
    return user[0]
  }

  async getInfo(userId: string): Promise<any> {
    try {
      const connected = await this.userDao.getById(userId);
      const user = connected?.toObject()
      delete user.passecode
      return { ...user };

    } catch (error) {
      throw error;
    }
  }

  async getUsers(Users: string) {
    // Obtenez les exemples depuis la base de données ou une autre source
    const data = await this.userDao.find({ Users });
    return data;
  }

  async deleteUser(_id: string) {
    const exist: any = await this.userDao.getById(_id)
    if (exist) {
      const data = await this.userDao.delete(_id);
      return data
    } else {
      return "Objet introuvable"
    }
  }

  async comparePwd(pwdExist: string, pwd: string) {
    const isValidPassword = bcrypt.compareSync(pwd, pwdExist);
    console.log(isValidPassword);
    if (!isValidPassword) {
      throw new CustomError("login ou mot de passe invalide !", 400);
    }
    return { status: 200, message: " Connexion reussie !" };
  }
  
  async updateUsers(_id:string, payload: UserDocument) {
    try {
      // Récuperer l'identifiant unique pour lenregistrement en cours
      const user: any = await this.userDao.getById(_id);
      const q:any = await this.userDao.update(user, payload)
      return q;
    } catch (error) {
      return { status: 500, message: null, data: error };
    }
  }
  
  // Définir d'autres contrôleurs selon les besoins
}