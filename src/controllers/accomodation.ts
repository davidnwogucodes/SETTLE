import { Request,Response,NextFunction } from "express";
import { createLodge, findLodgeById, findLodgeByName, getLodges, updateLodge } from "../modules/lodge/lodge";
import { raiseException } from "../utils/helper";

export const AddLodge = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        //TODO: should images be an array of images?
        const {name,school,rooms} = req.body;
        // TODO: implement redis as a cache mechanism
        // @ts-ignore  
        const userId = req.userId;
        const {image} = (req as any).file;   
        //TODO: process image and send to cloudinary
        const response = await createLodge({name,image,schoolId:school,landlordId:userId,rooms});
        if(response.error){
            next(response.error);
        }
        if(response.success !== true){
            return res.json({
                success:false,
                message:response.message
            })
        }
        res.json({
            success:true,
            message:"Lodge uploaded successfully"
        })
    } catch (error) {
        next(error);
    }
}


export const FindById = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id} = req.params;
        const response = await findLodgeById(id);
        if(response.error){
            next(response.error);
        }
        if(response.success !== true){
            return res.json({
                success:false,
                message:response.message
            });
        }
        res.json({
            success:true,
            data:response.data
        })
    } catch (error) {
        next(error);
    }
}

export const FindByName = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {name} = req.query;
        if(!name){
            next(raiseException("a lodge name is required"))
        }
        const response = await findLodgeByName(name!.toString());

        if(response.error){
            next(response.error);
        }
        if(response.success !== true){
            return res.json({
                success:false,
                message:response.message
            });
        }
        res.json({
            success:true,
            data:response.data
        })
    } catch (error) {
        next(error);
    }
}

export const UpdateLodge = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        // @ts-ignore
        const userId = req.userId;
        const {image} = (req as any).file;
        const response = await updateLodge(userId,req.params.id,{...req.body,image})
         
        if(response.error){
            next(response.error);
        }
        if(response.success !== true){
            return res.json({
                success:false,
                message:response.message
            });
        }
        res.json({
            success:true,
            message: "lodge updated successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const GetLodges = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const response = await getLodges();
        
        if(response.error){
            next(response.error);
        }
        if(response.success !== true){
            return res.json({
                success:false,
                message:response.message
            });
        }
        res.json({
            success:true,
            data:response.data
        })
    } catch (error) {
        next(error);
    }
}




