import { upload,deleteResource,updateResource,findById,getAll } from "../modules/resources/pastquestions";
import {Request,Response,NextFunction} from "express";
import { raiseException } from "../utils/helper";



export const CreateResource = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const file = req.file;
        const {department,courseCode,courseTitle} = req.body;
        if(!file){
            next(raiseException("a file must be uploaded"));
        }
        const details = {
            fileUrl:file!.path,
            department,courseCode,courseTitle
        }
        const response = await upload(details);
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
            message:"past question added successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const UpdateResource = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const file = req.file;
        const {id} = req.params;
        const details = {
            fileUrl:file,...req.body
        }
        if(!id){
            next(raiseException("a resource id is required"));
        }
        const response = await updateResource(parseInt(id),details);
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
            message:"resource updated successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const FindById = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id} = req.params;
        if(!id){
            next(raiseException("an id is required"));
        }
        const response = await findById(parseInt(id));
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

export const GetAll = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const response = await getAll();
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

export const DeleteResource = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id} = req.params;
        if(!id){
            next(raiseException("a resource id is required"));
        }
        const response = await deleteResource(parseInt(id));
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