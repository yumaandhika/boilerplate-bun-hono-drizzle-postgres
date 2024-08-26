import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { Config } from '../config/Config';

const {
  username, 
  password, 
  host,
  port, 
  db_name,
  ssl
} = Config.postgre;

const queryClient = postgres(`postgres://${username}:${password}@${host}:${port}/${db_name}?ssl=${ssl}`!);
export const db = drizzle(queryClient);