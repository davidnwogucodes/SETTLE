import db from "../../database/models"
import {randomBytes} from "crypto"

export const getAnnonId = async(userId:string)=>{
    try {
        // @ts-ignore
        const annonUser = await db.AnnonUser.findOrCreate({where:{UserId:userId},default:{
            annonId:generateAnnonId()
        }});
        return annonUser[0].id;
    } catch (error) {}
}

export const generateAnnonId = ():string=>{
    const token = randomBytes(5).toString("hex").substring(0,5).toUpperCase();
    return `Annon-${token}`;
}
