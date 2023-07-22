import {CronJob} from "cron";
import { Op } from "sequelize/types";
import db from "./database/models";

export const resetStories = ()=>{
    const A_DAY_AGO = new Date(Date.now() - 1000*60*60*24);
    // run every minute
   return (new CronJob("0 1 * * * *",async()=>{
    // @ts-ignore
    await db.Story.destroy({where:{createdAt:{[Op.gte]:A_DAY_AGO}}});
            },null,
            true,"Africa/Lagos")).start();
}