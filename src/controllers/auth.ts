import { NextFunction, Request, Response } from "express";
import { confirmUser, followUser, login, resendConfirmation, serviceResponse, signup, unfollowUser } from "../modules/auth/authentication";
import { raiseException } from "../utils/helper";
import { assignTokens, isAuth } from "../utils/Jwt";

enum ApiResponseMessage{
    SIGNUP_SUCCESSFUL = "user signed up successfully",
    UNAUTHORIZED = "request unauthorized, invalid token",
    USER_VERIFIED = "account verified successfully",
    CONFIRMATION_CODE_SENT = "confirmation code sent"
}

export const Signup = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {firstname,lastname,email,password,phone} = req.body;
        const response:serviceResponse = await signup(firstname,lastname,email,phone,password);
        if(response.error){
            next(response.error)
        }
        if(response.success !== true){
            return res.json({
                success:false,
                message:response.message
            })
        }
        //should token be sent after signup? yes, it will be needed for user confirmation
        const userId:string = response.data as string;

        const tokens = assignTokens(userId);

        return res.json({
            success:true,
            message:ApiResponseMessage.SIGNUP_SUCCESSFUL,
            data:tokens
        });
    } catch (error) {
        next(error);
    }
}

export const ConfirmUser = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const code = req.body;
        if(!isAuth(req)){
            return res.json({
                success:false,
                message:ApiResponseMessage.UNAUTHORIZED
            });
        }
        // @ts-ignore
        const userId = req.userId;
        const response = await confirmUser(userId,code);
        if(response.error){
            next(response.error);
        }
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }

        return res.json({
            success:true,
            message:ApiResponseMessage.USER_VERIFIED
        })

    } catch (error) {
        next(error)
    }
}

export const ResendConfirmationCode = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        if(!isAuth(req)){
            return res.json({
                success:false,
                message:ApiResponseMessage.UNAUTHORIZED
            });
        }
        // @ts-ignore
        const userId = req.userId;
        const response = await resendConfirmation(userId);
        if(response.error){
            next(response.error);
        }
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        return res.json({
            success:true,
            message:ApiResponseMessage.CONFIRMATION_CODE_SENT
        })
    } catch (error) {
        next(error)
    }
}

export const Login = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const {email,password} = req.body;
        const response = await login(email,password);
        if(response.error){
            next(response.error);
        }
        if(response.success == false){
            return res.json({
                success:false,
                message:response.message
            })
        }
        //TODO: do checks for user with such roles in roles table
        const tokens = assignTokens(response.data);
        return res.json({
            success:true,
            data:tokens
        });
    } catch (error) {
        next(error)
    }
}

export const Follow = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        // @ts-ignore
        const userId = req.userId;
        const {followedId} = req.params;
        if(!followedId){
            next(raiseException("a followed id is required"));
        }
        const response = await followUser(followedId,userId);
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
            message:"user followed successfully"
        })
    } catch (error) {
        next(error)
    }
}
// "/follow/user/:id"
export const UnFollow = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        // @ts-ignore
        const userId = req.userId;
        const {followedId} = req.params;
        if(!followedId){
            raiseException("a followed id is required");
        }
        const response = await unfollowUser(followedId,userId);
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
            message:"user unfollowed successfully"
        })
    } catch (error) {
        next(error)
    }
}
