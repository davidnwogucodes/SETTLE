import express,{Request,Response,NextFunction,Application} from "express";
import compression from "compression";
import cors from "cors";
import ApiError from "./utils/error/ApiError";
import db from  "./database/models";
import { roles } from "./database/models/Roles";
import { resetStories } from "./resetStories";



const app:Application = express();

app.use(compression());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended:true}));

(async function(){
    try {
      await db.sequelize.authenticate()
      console.log("Connection to database established");
      await db.sequelize.sync({force:true});
    //   await db.sequelize.sync();
    for(let role in roles){
      await db.Role.create({role:roles[role as keyof typeof roles]});
    }
      console.log("'\n' database synchronized");
    } catch (error) {
      console.log((error as Error).message)
    }
  })();
  

  resetStories();

app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
    if(err){
        if(err instanceof ApiError){
            return res.status(err.statusCode).json({error:err.message})
        }
        //TODO: channel logs to sentry/winston
        console.log(err)
        return res.status(500).json({error:err})
    }
})

export default app;