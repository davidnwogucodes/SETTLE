import db from "../../database/models";
import { isValidString, isValidUUID, raiseException } from "../../utils/helper";


enum serviceResponseMessages{
    COMMENT_CREATION_ERROR = "error creating comment",
    COMMENT_CREATION_SUCCESS = "successfully created comment",
    COMMENT_UPDATE_ERROR = "cannot update comment",
    INVALID_COMMENT = "cannot find lodge",
    COMMENT_DELETION_ERROR = "cannot delete comment"
}

interface serviceResponse{
    success:boolean;
    message?:serviceResponseMessages;
    data?:any;
    error?:string | object;
}

interface commentDetails {
    userId:string;
    storyId:string;
    comment?:string;
}

export const createComment = async (storyId:string,userId:string,comment:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid user id");
        }
        if(!isValidUUID(storyId)){
            raiseException("invalid story id");
        }
        if(isValidString(comment)){
            raiseException("invalid comment");
        }
        // @ts-ignore
        const newStory = await db.Comment.create({UserId:userId,StoryId:storyId,comment});
        if(!newStory || newStory == undefined){
            return {
                success:false,
                message:serviceResponseMessages.COMMENT_CREATION_ERROR
            }
        }
        return {
            success:true,
            message: serviceResponseMessages.COMMENT_CREATION_SUCCESS
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

export const updateComment = async (userId:string,commentId:string,comment:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid uuser id")
        }
        if(!isValidUUID(commentId)){
            raiseException("invalid comment id");
        }
        // @ts-ignore
        const updatedComment = await db.Comment.update({comment},{where:{id:commentId,UserId:userId}});
        if(!updatedComment || updatedComment == undefined){
            return {
                success:false,
                message: serviceResponseMessages.COMMENT_UPDATE_ERROR
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

export const findById = async (commentId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(commentId)){
            raiseException("invalid comment id");
        }
        const comment = await db.Comment.findOne({where:{id:commentId}});
        if(!comment || comment == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_COMMENT
            }
        }
        return {
            success:true,
            data:comment
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


export const deleteComment = async (userId:string,commentId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(commentId)){
            raiseException("invalid comment id");
        }
         // @ts-ignore
        const isDeleted = await db.Comment.destroy({where:{id:commentId,UserId:userId}});
        if(!isDeleted || isDeleted == undefined){
            return {
                success:false,
                message:serviceResponseMessages.COMMENT_DELETION_ERROR
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