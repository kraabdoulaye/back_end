import DataOptions from '../types/DataOptions';
import { IDao } from '../types/IDao';
import mysql from 'mysql2/promise';

interface SqlDataObject {
    [key: string]: any;
  }
  
  interface JoinObject {
    table: string;
    mainField: string;
    joinField: string;
  }

export class MysqlDao<T extends SqlDataObject> implements IDao<T> {
    private table: string;
    private connection: mysql.Connection;
  
    constructor(table: string, connection: mysql.Connection) {
      this.table = table;
      this.connection = connection;
    }
  getByCriterial(criterial: object): Promise<T | T[] | null> {
    throw new Error('Method not implemented.');
  }
  getByItem(item: object): Promise<T | T[] | null> {
    throw new Error('Method not implemented.');
  }
  slice(start?: number | undefined, end?: number | undefined): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  filter(arg0: (stagiaire: any) => any): unknown {
    throw new Error('Method not implemented.');
  }
  bulkCreate?(items: []): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

    async getById(id: string): Promise<T | null> {
        const [rows] = await this.connection.execute(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
        return ((rows as mysql.RowDataPacket[])[0] || null) as T;
    }

    async getByCriteria(criteria: SqlDataObject): Promise<T[]> {
        const keys = Object.keys(criteria);
        const values = Object.values(criteria);
        const criteriaString = keys.map((key, index) => `${key} = ?`).join(' AND ');
        const [rows] = await this.connection.execute(`SELECT * FROM ${this.table} WHERE ${criteriaString}`, values);
        return ((rows as mysql.RowDataPacket[]) || null) as unknown as T[];
    }

    async getAllAgregate(dataOptions: DataOptions[]): Promise<T[]> {
      let query = `SELECT * FROM ${this.table}`;
  
      for (const option of dataOptions) {
          for (const nestedField of option.nestedFields ?? []) {
              query += ` JOIN ${nestedField} ON ${this.table}.${option.fieldName} = ${nestedField}.${option.fieldName}`;
          }
      }
  
      const [rows] = await this.connection.execute(query);
      return ((rows as mysql.RowDataPacket[]) || null) as unknown as T[];
    }
    async all() {
        let query = `SELECT * FROM ${this.table}`;

    
        const [rows] = await this.connection.execute(query);
        return ((rows as mysql.RowDataPacket[]) || null) as unknown as T[];
      }

    async create(item: T): Promise<T> {
        const keys = Object.keys(item);
        const values = Object.values(item);
        const keysString = keys.join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        const [result] = await this.connection.execute(`INSERT INTO ${this.table} (${keysString}) VALUES (${placeholders})`, values) as any;
        const [rows] = await this.connection.execute(`SELECT * FROM ${this.table} WHERE id = ?`, [result.insertId as number]);
        return ((rows as mysql.RowDataPacket[])[0] || null) as T;
    }

    async update(id: string, item: T): Promise<T | null> {
        const keys = Object.keys(item);
        const values = Object.values(item);
        const keysString = keys.map((key) => `${key} = ?`).join(', ');
        await this.connection.execute(`UPDATE ${this.table} SET ${keysString} WHERE id = ?`, [...values, id]);
        const [rows] = await this.connection.execute(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
        return ((rows as mysql.RowDataPacket[])[0] || null) as T;
    }

    async delete(id: string): Promise<T | null> {
        const [rows] = await this.connection.execute(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
        const item = (rows as mysql.RowDataPacket[])[0] || null;
        await this.connection.execute(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
        return item as T;
    }
    async count(): Promise<number> {
      const [rows] = await this.connection.execute(`SELECT COUNT(*) as count FROM ${this.table}`);
      const count = (rows as mysql.RowDataPacket[])[0].count;
      return count as number;
    }
  
    async find(criteria: SqlDataObject): Promise<T[]> {
      const keys = Object.keys(criteria);
      const values = Object.values(criteria);
      const criteriaString = keys.map((key) => `${key} = ?`).join(' AND ');
      const [rows] = await this.connection.execute(`SELECT * FROM ${this.table} WHERE ${criteriaString}`, values);
      return ((rows as mysql.RowDataPacket[]) || null) as unknown as T[];
    }
}