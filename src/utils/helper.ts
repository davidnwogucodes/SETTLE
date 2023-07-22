
import db from "../database/models";


export const isValidMail = (emailAddress:string):boolean=>{
    try {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(emailAddress).toLowerCase());
    } catch (error) {
        return false;
    }
}

export const sanitizeString = (text:string):string =>{
    try {
        return text.replace(/[\\\.\+\*|?\^\$\[\]\(\)\{\}\/\'\#\:\!\=\|]/ig,"\\$&");
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

export const isValidString = (String:string):boolean=>{
    if(!String || typeof String !== "string"){
        return false
    }
    return true;
}

export const raiseException = <T extends string|undefined>(message:T):Error=>{
    return new Error(message);
}

export const generateVerificationCode = ():number=>{
    return Math.floor((Math.random() * 10000) + 100000);
}

export const isValidUUID = (uuid:string):boolean=>{
    
    const re = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return re.test(uuid);
}

export const isValidPhoneNumber = (mobileNumber:string):boolean =>{
    const re = /(^[0]\d{10$})|(^[\+]?[234]\d{12}$)/
    return re.test(mobileNumber);
}

export const isExistUser = async (userId:string):Promise<boolean> =>{
    try {
        const user = await db.User.findOne({where:{id:userId}});
        if(!user || (typeof user == null || undefined)){
            return false;
        }
        return true;
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return false;
    }
}



