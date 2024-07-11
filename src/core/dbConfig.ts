import mongoose, { Connection } from 'mongoose';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
dotenv.config();

const { DB_TYPE, DB_URI, MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, DB_NAME } = process.env;

let connection: Connection | mysql.Connection;

export const connectDb = async () => {
  switch (DB_TYPE) {
    case 'mongodb':
        if (!DB_URI) {
            throw new Error('Please provide a valid MongoDB URI');
        }
        await mongoose.connect(`${DB_URI}${DB_NAME}?authSource=admin`);
        connection = mongoose.connection;
        console.log('Connected to MongoDB');
        break;
    case 'mysql':
        if (!(MYSQL_HOST && MYSQL_USER && MYSQL_PASSWORD && MYSQL_DB)) {
            throw new Error('Please provide valid MySQL connection details');
        }
        connection = await mysql.createConnection({
          host: MYSQL_HOST,
          user: MYSQL_USER,
          password: MYSQL_PASSWORD,
          database: MYSQL_DB,
        });
        console.log('Connected to MySQL');
        break;
    default:
      throw new Error(`Unsupported database type "${DB_TYPE}"`);
  }
};

export const getDbConnection = () => {
  if (!connection) {
    throw new Error('Database connection not initialized. Please call connectDb() before getDbConnection().');
  }
  return connection;
};
