import DataOptions from "./DataOptions";
import { Model, Document, FilterQuery, PopulateOptions, UpdateQuery, Query } from 'mongoose';
export interface IDao<T> {
  all: any;
  getById(id: string): Promise<T | null>;
  getByCriteria(criteria: object): Promise<T[]|null|T>;
  getByCriterial(criterial: object): Promise<T[]|null|T>;
  getByItem(item: object): Promise<T[]|null|T>;
  getAllAgregate(dataOptions?: DataOptions[]): Promise<T[]>;
  create(item: T): Promise<T>;
 
  update(id: string, item: T | any): Promise<T | null>;
  delete(id: string): Promise<T | null>; 
  count(criteria?: FilterQuery<T>): Promise<number>;
  bulkCreate?(items: []): Promise<T[]>;
  find(criteria: FilterQuery<T>, options?:any);
  
  // slice(start?: DataOptions [], end?: number): Promise<T[]>;
  slice(start?: number, end?: number): Promise<T[]>;
}