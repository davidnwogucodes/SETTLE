import "dotenv/config";
import { Op } from "sequelize/types";

import db from "../../database/models";
import { isValidString, isValidUUID, raiseException, sanitizeString } from "../../utils/helper";

enum serviceResponseMessages{
    INVALID_LODGE = "invalid lodge,lodge not found",
    INVALID_SCHOOL = "invalid school property",
    LODGE_UPDATE_ERROR = "error updating lodge"
}

interface serviceResponse{
    success:boolean;
    message?:serviceResponseMessages;
    data?:any;
    error?:string|object;
}

interface IRoomCreationAttributes{
    name:string;
    rooms:number;
    image:string;
    schoolId:string;
    landlordId:string;
}

export const createLodge = async ({name,rooms,image,schoolId,landlordId}:IRoomCreationAttributes):Promise<serviceResponse>=>{
    try {
        if(!isValidString(name)){
            raiseException("a valid lodge name is required");
        }
        if(!isValidUUID(schoolId)){
            raiseException("please select one of the available schools");
        }
        if(isNaN(rooms)){
            raiseException("number of rooms is required");
        }
        if(!isValidUUID){
            raiseException("invalid landlord id");
        }

        name = sanitizeString(name);

        const school = await db.School.findOne({where:{id:schoolId}});
        if(!school){
            return {
                success:false,
                message: serviceResponseMessages.INVALID_SCHOOL
            }
        }
        // TODO:cloudinary services and google oauth
        // @ts-ignore
        const newLodge = await db.Lodge.create({name,rooms,imageUrl:image,LandlordId:landlordId});
        return {
            success:true,
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return {
            success:false,
            error:error as string|object
        }
    }
}

// find lodge
export const findLodgeById = async(lodgeId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(lodgeId)){
            raiseException("invalid lodge id");
        }
        const lodge = await db.Lodge.findOne({where:{id:lodgeId}});

        if(!lodge || lodge == undefined){
            return {
                success:false,
                message: serviceResponseMessages.INVALID_LODGE
            }
        }

        return {
            success:true,
            data:lodge
        }
        

    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return {
            success:false,
            error:error as string|object
        }
    }
}

export const findLodgeByName = async(lodgeName:string):Promise<serviceResponse>=>{
    try {
        if(!isValidString(lodgeName)){
            raiseException("invalid lodge name");
        }
        lodgeName = sanitizeString(lodgeName);
        const lodge = await db.Lodge.findAll({where:{name:{[Op.like]:`%{lodgeName}%`}}});
        if(!lodge || lodge == undefined){
            return {
                success:false,
                message: serviceResponseMessages.INVALID_LODGE
            }
        }
        return {
            success:true,
            data:lodge
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return {
            success:false,
            error:error as string|object
        }
    }
}

export const updateLodge = async(landLordId:string,lodgeId:string,details:Partial<IRoomCreationAttributes>):Promise<serviceResponse>=>{
    try {
        // @ts-ignore
        const isUpdated = await db.Lodge.update({...details},{where:{id:lodgeId,LandlordId:landLordId}});

        if(!isUpdated){
            return {
                success:false,
                message:serviceResponseMessages.LODGE_UPDATE_ERROR
            }
        }

        return {
            success:true,
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return {
            success:false,
            error:error as string|object
        }
    }
}

export const getLodges = async ():Promise<serviceResponse>=>{
    try {
        const lodges = await db.Lodge.findAll({include:[{all:true}]});
        return {
            success:true,
            data:lodges
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return {
            success:false,
            error:error as string|object
        }
    }
}