import db from "../../database/models";
import { isValidString, isValidUUID, raiseException } from "../../utils/helper";
import {getAnnonId} from "./helper";

enum serviceResponseMessages{
    CREATE_AnnonPost_ERROR = "error creating AnnonPost",
    INVALID_AnnonPost = "user AnnonPost not found",
    NO_FEEDS = "follow users to see feeds",
    COMMENT_ERROR = "cannot create comment",
    UPDATE_COMMENT_ERROR = "error update comment",
    DELETE_COMMENT_ERROR = "error deleting comment",
    LIKE_AnnonPost_ERROR = "cannot like AnnonPost",
    LIKE_COMMENT_ERROR = "cannot like comment"
}

interface serviceResponse{
    success:boolean;
    message?:string;
    error?:string|object;
    data?:any;
}


export const post = async(userId:string,content:string,image?:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("user id is required")
        }
        if(!isValidString(content)){
            raiseException("post content cannot be empty")
        }
        const annonId = await getAnnonId(userId);
        // @ts-ignore
        const newAnnonPost = await db.AnnonPost.create({content,AnnonUserId:annonId,imageUrl:image});

        if(!newAnnonPost || newAnnonPost == undefined){
            return {
                success:false,
                message:serviceResponseMessages.CREATE_AnnonPost_ERROR
            }
        }
        return{
            success:true
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message)
        }
        return{
            success:false,
            error:error as string | object
        }
    }
}

export const findById = async (AnnonPostId:number):Promise<serviceResponse>=>{
    try {
        if(isNaN(AnnonPostId)){
            raiseException("invalid AnnonPost id");
        }
        const story = await db.AnnonPost.findOne({where:{id:AnnonPostId},include:[db.Comment]});
        if(!story || story == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_AnnonPost
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

export const getAll = async ()=>{
    try {
        // @ts-ignore
        const feeds = await db.AnnonPost.findAll({order:[["createdAt","DESC"]]})
        if(!feeds || feeds == undefined){
            return{
                success:false,
                message:serviceResponseMessages.NO_FEEDS
            }
        }
        return {
            success:true,
            data:feeds
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

export const comment = async (userId:string,AnnonPostId:number,comment:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid userId");
        };
        if(isNaN(AnnonPostId)){
            raiseException("invalid AnnonPost id");
        }
        if(!isValidString(comment)){
            raiseException("invalid comment")
        }
        const annonId = await getAnnonId(userId);
        const likers = JSON.stringify([]);

        // @ts-ignore
        const newComment = await db.AnnonComment.create({comment,AnnonUserId:annonId,PostId:AnnonPostId,likers});
        if(!newComment || newComment == undefined){
            return{
                success:false,
                message:serviceResponseMessages.COMMENT_ERROR
            }
        }
        return{
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

export const updateComment = async(userId:string,commentId:string,comment:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid user id")
        }
        if(!isValidUUID(commentId)){
            raiseException("invalid comment id")
        }
        if(!isValidString(comment)){
            raiseException("invalid comment");
        }
        const annonId = await getAnnonId(userId)
        // @ts-ignore
        const isUpdated = await db.AnnonComment.update({comment},{where:{id:commentId,AnnonUserId:annonId}});
        if(!isUpdated){
            return {
                success:false,
                message: serviceResponseMessages.UPDATE_COMMENT_ERROR
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


export const deleteComment = async (userId:string,commentId:string)=>{
    try {
        if(isValidUUID(userId)){
            raiseException("invalid user id")
        }
        if(!isValidUUID(commentId)){
            raiseException("invalid comment id")
        }
        const annonId = await getAnnonId(userId);
        // @ts-ignore
        const isDeleted = await db.AnnonComment.destroy({where:{id:commentId,AnnonUserId:annonId}});
        if(!isDeleted){
            return{
                success:false,
                message: serviceResponseMessages.DELETE_COMMENT_ERROR
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

export const likePost = async(AnnonPostId:number,userId:string):Promise<serviceResponse>=>{
    try {
        if(isNaN(AnnonPostId)){
            raiseException("invalid comment id")
        }
        if(!isValidUUID(userId)){
            raiseException("invalid user id")
        }
        const annonId = await getAnnonId(userId);
        const AnnonPost = await db.AnnonPost.findOne({where:{id:AnnonPostId}});
        const likersStr = AnnonPost?.likers;
        let likers = JSON.parse(likersStr!);
        if(likers.includes(annonId)){
         likers = likers.filter((liker:number) => liker !== annonId); 
         await db.AnnonPost.update({likes:likers.length,likers:JSON.stringify(likers)},{where:{id:AnnonPostId}}); 
        }
        likers.push(annonId);
        await db.AnnonPost.update({likes:likers.length,likers:JSON.stringify(likers)},{where:{id:AnnonPostId}}); 
        return{
            success:false,
            message: serviceResponseMessages.LIKE_AnnonPost_ERROR
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

export const likeComment = async(commentId:string,userId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(commentId)){
            raiseException("invalid comment id")
        }
        if(!isValidUUID(userId)){
            raiseException("invalid user id")
        }
        const annonId = await getAnnonId(userId);
        const comment = await db.AnnonComment.findOne({where:{id:commentId}});
        const likersStr = comment?.likers;
        let likers = JSON.parse(likersStr!);
        if(likers.includes(annonId)){
         likers = likers.filter((liker:number) => liker !== annonId); 
         await db.AnnonComment.update({likes:likers.length,likers:JSON.stringify(likers)},{where:{id:commentId}}); 
        }
        likers.push(annonId);
        await db.AnnonComment.update({likes:likers.length,likers:JSON.stringify(likers)},{where:{id:commentId}}); 
        return{
            success:false,
            message: serviceResponseMessages.LIKE_COMMENT_ERROR
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


export const replyComment = async (userId:string,commentId:string,comment:string)=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid user id");
        }

        if(!isValidUUID(commentId)){
            raiseException("invalid comment id")
        }
        const annonId = await getAnnonId(userId);
        // @ts-ignore
        const newComment = await db.AnnonComment.create({comment,AnnonUserId:annonId,AnnonCommentId:commentId});
        if(!newComment || newComment == undefined){
            return {
                success:false,
                message: serviceResponseMessages.COMMENT_ERROR
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