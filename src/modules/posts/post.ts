import { Op } from "sequelize/types";
import db from "../../database/models";
import { isValidString, isValidUUID, raiseException } from "../../utils/helper";


enum serviceResponseMessages{
    POST_CREATION_ERROR = "unable to create post",
    INVALID_POST = "user POST not found",
    NO_FEEDS = "follow users to see feeds",
    COMMENT_ERROR = "cannot create comment",
    UPDATE_COMMENT_ERROR = "error update comment",
    DELETE_COMMENT_ERROR = "error deleting comment",
    LIKE_POST_ERROR = "cannot like post",
    LIKE_COMMENT_ERROR = "cannot like comment"
}


interface serviceResponse{
    success:boolean,
    message?:serviceResponseMessages,
    data?:any,
    error?:string | object
}

export const createPost = async (post:string,userId:string,image?:string):Promise<serviceResponse>=>{
    try {
        if(!isValidString(post)){
            raiseException("invalid post");
        };
        if(!isValidUUID(userId)){
            raiseException("invalid user id")
        }
        // @ts-ignore
        const newPost = await db.Post.create({UserId:userId,content:post,image});
        if(!newPost || newPost == undefined){
            return {
                success:false,
                message:serviceResponseMessages.POST_CREATION_ERROR
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

export const findById = async (postId:number):Promise<serviceResponse>=>{
    try {
        if(isNaN(postId)){
            raiseException("invalid post id");
        }
        const story = await db.Post.findOne({where:{id:postId},include:[db.Comment]});
        if(!story || story == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_POST
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

// get all followees' post

export const getFeeds = async (userId:string)=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid user id");
        }
        // @ts-ignore
        const followers = await db.User.getFollowers();
        // @ts-ignore
        const followersId:string[] = followers.map(follower =>follower.id);
        // @ts-ignore
        const feeds = await db.Post.findAll({where:{UserId:{[Op.in]:followersId}},order:[["createdAt","DESC"]]});
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

export const comment = async (userId:string,postId:number,comment:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid userId");
        };
        if(isNaN(postId)){
            raiseException("invalid post id");
        }
        if(!isValidString(comment)){
            raiseException("invalid comment")
        }

        // @ts-ignore
        const newComment = await db.Comment.create({comment,UserId:userId,PostId:postId});
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
        // @ts-ignore
        const isUpdated = await db.Comment.update({comment},{where:{id:commentId,UserId:userId}});
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
        if(!isValidUUID(userId)){
            raiseException("invalid user id")
        }
        if(!isValidUUID(commentId)){
            raiseException("invalid comment id")
        }
        // @ts-ignore
        const isDeleted = await db.Comment.destroy({where:{id:commentId,UserId:userId}});
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

export const likePost = async(postId:string,userId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(postId)){
            raiseException("invalid comment id")
        }
        if(!isValidUUID(userId)){
            raiseException("invalid user id")
        }
        const post = await db.Post.findOne({where:{id:postId}});
        const likersStr = post?.likers;
        let likers = JSON.parse(likersStr!);
        if(likers.includes(userId)){
         likers = likers.filter((liker:string) => liker !== userId); 
         await db.Post.update({likes:likers.length,likers:JSON.stringify(likers)},{where:{id:postId}}); 
        }
        likers.push(userId);
        await db.Post.update({likes:likers.length,likers:JSON.stringify(likers)},{where:{id:postId}}); 
        return{
            success:false,
            message: serviceResponseMessages.LIKE_POST_ERROR
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
        const comment = await db.Comment.findOne({where:{id:commentId}});
        const likersStr = comment?.likers;
        let likers = JSON.parse(likersStr!);
        if(likers.includes(userId)){
         likers = likers.filter((liker:string) => liker !== userId); 
         await db.Comment.update({likes:likers.length,likers:JSON.stringify(likers)},{where:{id:commentId}}); 
        }
        likers.push(userId);
        await db.Comment.update({likes:likers.length,likers:JSON.stringify(likers)},{where:{id:commentId}}); 
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
        // @ts-ignore
        const newComment = await db.Comment.create({comment,UserId:userId,CommentId:commentId});
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