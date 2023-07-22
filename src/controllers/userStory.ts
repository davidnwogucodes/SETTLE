import { Request,Response,NextFunction, request } from "express";
import { createComment, deleteComment, updateComment } from "../modules/stories/comment";
import { findById,createStory,getAllStories,findByUser, saveStory, } from "../modules/stories/story";
import { raiseException } from "../utils/helper";


export const FindById = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id} = req.params;
        if(!id){
           return next(raiseException("story id must be provided"));
        }
        const response = await findById(id);
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

export const CreateStory = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {story} = req.body;
        const image = req.file;
        // @ts-ignore
        const userId = req.userId;
        const response = await createStory(story,userId,image!.path);
        if(response.error){
            next(response.error);
        }
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            });
        }

        res.json({
            success:true,
            message:"story added successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const GetAllStories = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const response = await getAllStories();
        if(response.error){
            next(response.error)
        }
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

export const FindByUser = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {user} = req.query;
        if(!user || user == undefined){
            next(raiseException("a user id is required"));
        }
        const response = await findByUser(user as string);
        if(response.error){
            next(response.error);
        }
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
        next(error);
    }
}

export const SaveStory = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        // @ts-ignore
        const userId = req.userId;
        const {storyId} = req.params;
        if(!storyId){
            next(raiseException("story id is required"));
        }
        const response = await saveStory(userId,storyId);
        if(response.error){
            next(response.error);
        }
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
            message:"story saved successfully"
        })
    } catch (error) {
        next(error)
    }
}