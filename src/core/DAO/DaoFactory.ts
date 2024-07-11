import { IDao } from '../types/IDao';
import { MongooseDao } from '../generic/MongooseDao';
import { MysqlDao } from '../generic/MysqlDao';
import { getDbConnection } from '../dbConfig';
import { Model, Document } from 'mongoose';
import mysql from 'mysql2/promise';
const instanceCache: Record<string, IDao<Document>> = {};
export const daoFactory = async <T extends Document>(model: Model<T>, tableName: string): Promise<IDao<T>> => {
    const cacheKey = `${model.collection.name}_${tableName}`;
  
    if (instanceCache[cacheKey]) {
      return instanceCache[cacheKey] as IDao<T>;
    }
  
    const connection = getDbConnection();
  
    let instance: IDao<Document>;
  
    switch (process.env.DB_TYPE) {
      case 'mongodb':
        instance = new MongooseDao<T>(model);
        break;
      case 'mysql':
        instance = new MysqlDao<T>(tableName, connection as mysql.Connection);
        break;
      default:
        throw new Error(`Unsupported database type "${process.env.DB_TYPE}"`);
    }
  
    instanceCache[cacheKey] = instance;
  
    return instance as IDao<T>;
  };
  