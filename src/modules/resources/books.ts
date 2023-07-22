import { Op } from "sequelize/types";
import { string } from "yup";
import db from "../../database/models";
import { BookCreationAttributes } from "../../database/models/Book";
import { isValidString, raiseException } from "../../utils/helper";

enum serviceResponseMessages{
    BOOK_CREATION_ERROR = "cannot add book at the moment",
    INVALID_BOOK = "cannot get book",
    BOOK_UPDATE_ERROR = "cannot update book",
    BOOK_DELETE_ERROR = "cannot delete book"
}

interface serviceResponse{
    success:boolean;
    message?:serviceResponseMessages;
    error?:string | object;
    data?: any;
}


export const createBook = async (name:string, category:string,file:string):Promise<serviceResponse>=>{
    try {
        if(!isValidString(name)){
            raiseException("invalid book name")
        }
        if(!isValidString(category)){
            raiseException("invalid book category")
        }
        const newBook = await db.Book.create({name,category,file});
        if(!newBook){
            return{
                success:false,
                message:serviceResponseMessages.BOOK_CREATION_ERROR
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


export const findById = async (bookId:number):Promise<serviceResponse>=>{
    try {
        if(isNaN(bookId)){
            raiseException("invalid book id")
        }
        const book = await db.Book.findByPk(bookId);
        if(!book || book == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_BOOK
            }
        }
        return {
            success:true,
            data:book
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

export const getAll = async ():Promise<serviceResponse>=>{
    try {
        const books = await db.Book.findAll();
        if(!books || books == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_BOOK
            }
        }
        return {
            success:true,
            data:books
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

export const updateBook = async (bookId:number,details:Partial<BookCreationAttributes>):Promise<serviceResponse>=>{
    try {
        if(isNaN(bookId)){
            raiseException("invalid book id")
        };
        const isUpdated = await db.Book.update({...details},{where:{id:bookId}});
        if(!isUpdated){
            return {
                success:false,
                message: serviceResponseMessages.BOOK_UPDATE_ERROR
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

export const findByName = async (name:string)=>{
    try {
        if(!isValidString(name)){
            raiseException("invalid book name")
        }
        const res = await db.Book.findAll({where:{name:{[Op.like]:`%${name}%`}}})
        if(!res || res == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_BOOK
            }
        }

        return {
            success:true,
            data:res
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

export const findByCategory = async (category:string)=>{
    try {
        if(!isValidString(category)){
            raiseException("invalid book category")
        }
        const res = await db.Book.findAll({where:{category:{[Op.like]:`%${category}%`}}})
        if(!res || res == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_BOOK
            }
        }

        return {
            success:true,
            data:res
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

export const deleteBook = async (bookId:number)=>{
    try {
        if(isNaN(bookId)){
            raiseException("invalid book id")
        }
        const isDeleted = await db.Book.destroy({where:{id:bookId}});
        if(!isDeleted){
            return{
                success:false,
                message: serviceResponseMessages.BOOK_DELETE_ERROR
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