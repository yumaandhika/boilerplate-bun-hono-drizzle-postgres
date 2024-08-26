import { defineConfig } from "drizzle-kit";
import { Config } from "./src/config/Config";

const {
  username, 
  password, 
  host, 
  port, 
  db_name,
  ssl
} = Config.postgre;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dbCredentials: {
    url: `postgres://${username}:${password}@${host}:${port}/${db_name}?ssl=${ssl}`,
  }
});