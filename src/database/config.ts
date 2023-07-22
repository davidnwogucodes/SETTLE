import "dotenv/config"
import { Sequelize,Dialect } from "sequelize";

const DB_NAME = process.env.DB_NAME as string;
const PG_PASS = process.env.PG_PASS as string;
const PG_USER = process.env.PG_USER as string;
const DIALECT = process.env.SEQUELIZE_DIALECT as Dialect;


 const sequelize = new Sequelize(DB_NAME,PG_USER,PG_PASS, {
    host:process.env.NODE_ENV == "development"?"localhost":process.env.DB_HOST,
    dialect:DIALECT,
     pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
      }
  });


  export default sequelize;