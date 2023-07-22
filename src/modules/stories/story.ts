import db from "../../database/models";
import { isValidString, isValidUUID, raiseException } from "../../utils/helper";


enum serviceResponseMessages{
    STORY_CREATION_ERROR = "unable to create user story",
    INVALID_STORY = "user story not found",
    SAVE_ERROR = "unable to save story"
}


interface serviceResponse{
    success:boolean,
    message?:serviceResponseMessages,
    data?:any,
    error?:string | object
}

export const createStory = async (story:string,userId:string,image?:string):Promise<serviceResponse>=>{
    try {
        if(!isValidString(story)){
            raiseException("invalid story");
        };
        if(!isValidUUID(userId)){
            raiseException("invalid user id");
        }
        // @ts-ignore
        const newStory = await db.Story.create({UserId:userId,story,image});
        if(!newStory || newStory == undefined){
            return {
                success:false,
                message:serviceResponseMessages.STORY_CREATION_ERROR
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

export const findById = async (storyId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(storyId)){
            raiseException("invalid story id");
        }
        const story = await db.Story.findOne({where:{id:storyId},include:[db.Comment]});
        if(!story || story == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_STORY
            }
        }
        return {
            success:true,
            data:story
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

export const findByUser = async (userId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid user id");
        }
        // @ts-ignore
        const userStory = await db.Story.findAll({where:{UserId:userId},include:[db.Comment]});
        if(!userStory || userStory == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_STORY
            }
        }
        return {
            success:true,
            data:userStory
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

// TODO: ask for user story validity

export const getAllStories = async ():Promise<serviceResponse>=>{
    try {
        const stories = await db.Story.findAll({include:[db.Comment]});
        return {
            success:true,
            data:stories
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

export const saveStory = async (userId:string,storyId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid user id");
        }

        if(!isValidUUID(storyId)){
            raiseException("invalid story id");
        }

        // @ts-ignore
        const isSaved = await db.Story.update({isSaved:true},{where:{id:storyId,UserId:userId}});
        if(!isSaved){
            return {
                success:false,
                message: serviceResponseMessages.SAVE_ERROR
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