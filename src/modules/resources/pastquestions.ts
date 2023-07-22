import db from "../../database/models";
import {PastQuestionCreationAttributes} from "../../database/models/PastQuestion";
import { isValidString, raiseException,isValidUUID } from "../../utils/helper";

enum serviceResponseMessages{
    UPLOAD_FILE_ERROR = "cannot upload resource at the moment",
    INVALID_RESOURCE = "invalid resource",
    RESOURCE_UPDATE_ERROR = "cannot update resource at the moment",
    RESOURCE_DELETE_ERROR = "cannot delet resource at the moment"
}

interface serviceResponse{
    success:boolean;
    message?:serviceResponseMessages;
    error?:string | object;
    data?:any;
}

export const upload = async ({courseCode,courseTitle,fileUrl,department,}:PastQuestionCreationAttributes):Promise<serviceResponse>=>{
    try {
       if(!isValidString(courseCode)){
           raiseException("a valid course code is required")
       }
       if(!isValidString(courseTitle)){
           raiseException("a valid couse title is required");
       }
       if(!isValidString(fileUrl)){
           raiseException("invalid file url")
       }
       if(!isValidString(department)){
           raiseException("a valid department is required")
       }
       const newPastQuestion = await db.PastQuestion.create({courseCode,courseTitle,fileUrl,department});
       if(newPastQuestion == null){
           return {
               success:false,
               message:serviceResponseMessages.UPLOAD_FILE_ERROR
           }
       }
       return {
           success:true
       }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message)
        }
        return {
            success:false,
            error:error as string | object
        }
    }
}

export const findById = async (resourceId:number):Promise<serviceResponse>=>{
    try {
        if(isNaN(resourceId)){
            raiseException("a valid resource id is required");
        }
        const resource = await db.PastQuestion.findByPk(resourceId);
        if(!resource || resource == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_RESOURCE
            }
        }
        return {
            success:true,
            data:resource
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message)
        }
        return {
            success:false,
            error:error as string | object
        }
    }
}

export const getAll = async():Promise<serviceResponse>=>{
    try {
        const resources = await db.PastQuestion.findAll();
        return {
            success:true,
            data:resources
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message)
        }
        return {
            success:false,
            error:error as string | object
        }
    }
}

export const updateResource = async(resourceId:number,details:Partial<PastQuestionCreationAttributes>):Promise<serviceResponse>=>{
    try {
        if(isNaN(resourceId)){
            raiseException("invalid resouce id");
        }
        const isUpdated = await db.PastQuestion.update({...details},{where:{id:resourceId}});
        if(!isUpdated || isUpdated == undefined){
            return {
                success:false,
                message:serviceResponseMessages.RESOURCE_UPDATE_ERROR
            }
        }

        return {
            success:true
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message)
        }
        return {
            success:false,
            error:error as string | object
        }
    }
}

export const deleteResource = async(resourceId:number):Promise<serviceResponse>=>{
    try {
        if(isNaN(resourceId)){
            raiseException("invalid resource id");
        }
        const isDeleted = await db.PastQuestion.destroy({where:{id:resourceId}});
        if(!isDeleted){
            return {
                success:false,
                message: serviceResponseMessages.RESOURCE_DELETE_ERROR
            }
        }
        return {
            success:true,
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message)
        }
        return {
            success:false,
            error:error as string | object
        }
    }
}