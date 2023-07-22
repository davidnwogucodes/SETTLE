import {Request,Response,NextFunction} from "express";
import { noExtendLeft } from "sequelize/types/lib/operators";
import { createPost,findById,getFeeds,comment,updateComment,deleteComment,likePost,likeComment, replyComment } from "../modules/posts/post";
import { raiseException } from "../utils/helper";

export const CreatePost = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {post} = req.body;
        const image = req.file;
        // @ts-ignore
        const userId = req.userId;
        const response = await createPost(post,userId,image?.path);

        if(response.error){
            next(response.error);
        };
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
            message:"post uploaded successfully"
        })

    } catch (error) {
        next(error)
    }
}

export const FindById = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id} = req.params;
        if(!id){
            next(raiseException("a post id is required"));
        }
        const response = await findById(parseInt(id));
        if(response.error){
            next(response.error);
        };
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
            data:response.data
        })
    } catch (error) {
        next(error)
    }
}

export const GetFeeds = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        // @ts-ignore
        const userId = req.userId;
        const response = await getFeeds(userId);
        if(response.error){
            next(response.error);
        };
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
            data:response.data
        })
    } catch (error) {
        next(error)
    }
}

export const Comment = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {comment} = req.body;
        const {postId} = req.params;
        // @ts-ignore
        const userId = req.userId;
        if(!postId){
            next(raiseException("a post id is required"))
        }
        const response = await comment(userId,postId,comment);
        if(response.error){
            next(response.error);
        };
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
            message:"comment added successfully"
        })

    } catch (error) {
        next(error)
    }
}

export const UpdateComment = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {comment} = req.body;
        const {commentId} = req.params;
        // @ts-ignore
        const userId = req.userId;
        if(!comment){
            next(raiseException("invalid comment"));
        }
        if(!commentId){
            next(raiseException("a comment id is required"))
        }
        const response = await updateComment(userId,commentId,comment);
        if(response.error){
            next(response.error);
        };
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
            message:"comment updated successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const DeleteComment = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {commentId} = req.params;
        // @ts-ignore
        const userId = req.userId;
        if(commentId){
            next(raiseException("a comment id is required"));
        }
        const response = await deleteComment(userId,commentId);
        if(response.error){
            next(response.error);
        };
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
            message:"comment deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const LikePost = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {postId} = req.params;
        // @ts-ignore
        const userId = req.userId;
        if(!postId){
            next(raiseException("a post id is required"))
        }

        const response = await likePost(postId,userId);
        if(response.error){
            next(response.error);
        };
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
        })
    } catch (error) {
        next(error)
    }
}

export const LikeComment = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {commentId} = req.params;
        // @ts-ignore
        const userId = req.userId;
        if(!commentId){
            next(raiseException("a comment id is required"));
        }

        const response = await likeComment(commentId,userId);

        if(response.error){
            next(response.error);
        };
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true
        })
    } catch (error) {
        next(error)
    }
}

export const ReplyComment = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {commentId} = req.params;
        const {comment} = req.body;
        // @ts-ignore
        const userId = req.userId;
        if(!commentId){
            next(raiseException("a comment id is required"));
        }

        const response = await replyComment(userId,commentId,comment);
        if(response.error){
            next(response.error);
        };
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
            message:"comment added successfully"
        })
    } catch (error) {
        next(error)
    }
}