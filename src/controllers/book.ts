import {Request,Response,NextFunction} from "express";
import { createBook,findById,getAll,updateBook,findByName,findByCategory,deleteBook } from "../modules/resources/books";

export const CreateBook = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {name,category} = req.body;
        const file = req.file;
        const response = await createBook(name,category,file!.path);
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
            message:"book added successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const FindById = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {bookId} = req.params;
        const response = await findById(parseInt(bookId));
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

export const UpdateBook = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {bookId} = req.params;
        const {name,category} = req.body;
        const file = req.file;
        const response = await updateBook(parseInt(bookId),{name,category,file:file!.path});
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
            message:"book updated successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const FindByName = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {name} = req.query;
        const response = await findByName(String(name));
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

export const FindByCategory = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {category} = req.query;
        const response = await findByCategory(String(category));
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

export const DeleteBook = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {bookId} = req.params;
        const response = await deleteBook(parseInt(bookId));
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
            message:"book deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}