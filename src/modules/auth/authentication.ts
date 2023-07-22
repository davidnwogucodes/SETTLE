import "dotenv/config";
import { hash,compare } from "bcrypt";
import { isValidMail,sanitizeString,isValidString,raiseException,generateVerificationCode,isValidUUID,isValidPhoneNumber } from "../../utils/helper";
import db from "../../database/models";
import { roles as ROLES } from "../../database/models/Roles";
import Sms from "../../utils/Sms";


const SALT_ROUNDS:number = parseInt(process.env.SALT_ROUND!); 
const SmsService = Sms;

export enum serviceResponseMessages{
    INVALID_USER = "invalid user,user doesn't exist",
    CODE_EXPIRED = "verification code expired, request a new code",
    INVALID_VERIFICATION_CODE = "invalid verification code",
    INVALID_PASSWORD = "invalid password",
    CODE_NOT_SENT = "cannot send OTP at the moment",
    UNAUTHORIZED_LANDLORD = "unauthorized,invalid landlord user",
    UNAUTHORIZED_ADMIN = "unauthorized, invalid admin user",
    FOLLOW_ERROR = "unable to follow user",
    CANNOT_FOLLOW = "already a follower",
    UNFOLLOW_ERROR = "unable to unfollow user",
    CANNOT_UNFOLLOW = "only followers can unfollow"
    
}

export interface serviceResponse {
    success:boolean;
    message?: serviceResponseMessages;
    data?:any
    error?:string | object;
}


export const signup = async(firstname:string,lastname:string,email:string,phone:string,password:string):Promise<serviceResponse>=>{
    try {
        if(!isValidString(firstname)){
            raiseException("firstname is required");
        }
        if(!isValidString(lastname)){
            raiseException("lastname is required");
        }
        if(!isValidString(email)){
            raiseException("email is required");
        }
        if(!isValidString(password)){
            raiseException("password is required")
        }
        if(!isValidString(phone)){
            raiseException("phone number is required");
        }
        if(!isValidMail(email)){
            raiseException("a valid email address is required");
        }
        if(!isValidPhoneNumber(phone)){
            raiseException("invalid phone number format");
        }
        let user = await db.User.findOne({where:{email:email.trim()}});
        if(user){
            raiseException("user already exists");
        }
        const hashedPassword = await hash(password,SALT_ROUNDS);
        const code = generateVerificationCode();
        const codeValidity = Date.now() + parseInt(process.env.VERIFICATION_CODE_VALIDITY!);

        const isCodeSent = await SmsService.sendVerificationCode(phone,code);

        if(!isCodeSent){
            return{
                success:false,
                message:serviceResponseMessages.CODE_NOT_SENT
            }
        }

        // TODO: a helper to handle dates

        firstname = sanitizeString(firstname);
        lastname = sanitizeString(lastname);
        user = await db.User.create({
            firstname,lastname,email,password:hashedPassword,verificationCode:code,verificationCodeValidity:codeValidity,
        });
        
        return {
            success:true,
            data:user.id
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message)
        }
        return {
            success:false,
            error:error as string|object
        }
    }
}


export const confirmUser = async(userId:string,code:number):Promise<serviceResponse>=>{
    try {
        
        if(!isValidUUID(userId)){
            raiseException("invalid user id");
        }
        const NOW = Date.now();
        const user = await db.User.findOne({where:{id:userId}});
        if(!user || user == undefined || user == null){
            return {
                success:false,
                message: serviceResponseMessages.INVALID_USER
            }
        }
        if(NOW > user.verificationCodeValidity){
            return {
                success:false,
                message:serviceResponseMessages.CODE_EXPIRED
            }
        }
        if(code !== user.verificationCode){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_VERIFICATION_CODE
            }
        }
        const isUpdated = await user.update({isVerified:true,verificationCode:undefined,verificationCodeValidity:undefined});
        if(!isUpdated){
            raiseException("problem verifying user, please try again");
        }
        return {
            success:true
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return {
            success:false,
            error:error as string|object
        }
    }
}
export const login = async(email:string,password:string):Promise<serviceResponse>=>{
    try {
        if(!(isValidString(email) || isValidMail(email))){
            raiseException("invalid mail format");
        }
        if(!isValidString(password)){
            raiseException("a password is required");
        }

        const user = await db.User.findOne({where:{email}});
        if(!user || (typeof user == undefined || null)){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_USER
            }
        }
        const isPasswordMatch = await compare(password,user.password);
        if(!isPasswordMatch){
            return {
                success:false,
                message: serviceResponseMessages.INVALID_PASSWORD
            }
        }
        return {
            success:true,
            data:user.id
        }
    } catch (error) {
        
        if(error instanceof Error){
            raiseException(error.message);
        }
        return {
            success:false,
            error:error as string|object
        }
    }
}

export const resendConfirmation = async(userId:string):Promise<serviceResponse>=>{
    try {
        if(!userId || !isValidUUID(userId)){
            raiseException("invalid user id");
        }
        const user = await db.User.findOne({where:{id:userId,isVerified:false}});
        if(!user || (typeof user == null || undefined)){
            return{
                success:false,
                message:serviceResponseMessages.INVALID_USER
            }
        }
        const code = generateVerificationCode();
        const codeValidity = Date.now() + parseInt(process.env.VERIFICATION_CODE_VALIDITY!);
        const isUpdated = await user.update({verificationCode:code,verificationCodeValidity:codeValidity});
        if(!isUpdated){
            raiseException("problem verifying user, please try again");
        }
        // reconfirm code after this is sent
        return {
            success:true
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return {
            success:false,
            error:error as string|object
        }
    }

}


export const resetPassword = async (userId:string,prevPassword:string,newPassword:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid user id");
        }
        if(!isValidString(prevPassword) || !isValidString(newPassword)){
            raiseException("password is required");
        }
        const user = await db.User.findOne({where:{id:userId}});
        if(!user || (typeof user == null || undefined)){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_USER
            }
        }
        const isPasswordMatch = await compare(prevPassword,user.password);
        if(!isPasswordMatch){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_PASSWORD
            }
        }
        const newHashedPassword = await hash(newPassword,SALT_ROUNDS);
        const isUpdated = await user.update({password:newHashedPassword});
        if(!isUpdated){
            raiseException("problem reseting password, please try again");
        }
        return {
            success:true
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return {
            success:false,
            error:error as string|object
        }
    }
}

export const forgotPassword = async (userId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(userId)){
            raiseException("invalid user id");
        }
        const user = await db.User.findOne({where:{id:userId}});
        if(!user || (typeof user == null || undefined)){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_USER
            }
        }
        //use this as password
        const code = generateVerificationCode();
        //TODO: send sms containing code as new password to user
        //hash code and store as user password in database
        const isSmsSent = await SmsService.sendPassword(user.phone,code);
        if(!isSmsSent){
            return {
                success:false,
                message:serviceResponseMessages.CODE_NOT_SENT
            }
        }
        const hashedPassword = await hash(code.toString(),SALT_ROUNDS);
        const isUpdated = await user.update({password:hashedPassword});
        if(!isUpdated){
            raiseException("problems reseting password, please try again");
        }
        return {
            success:true,
            data:user.id
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }

        return {
            success:false,
            error:error as string | object
        }
    }
}

export const loginLandlord = async (email:string,password:string):Promise<serviceResponse> =>{
    try {
        // TODO:check this
        // @ts-ignore
        let user:any = await db.Landlord.findOne({where:{email},include:{
            model:db.User,
            required:true
        }})
        if(!user || user == null){
         user = await db.Admin.findOne({include:{
             model:db.User,
             required:true,
             where:{email}
         }});
        }
        if(!user || user == null){
            // @ts-ignore
            return {
                success:false,
                message:serviceResponseMessages.UNAUTHORIZED_LANDLORD
            }
       
        }
        const isMatchedPassword = await compare(password,user.password!);
        if(!isMatchedPassword){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_PASSWORD
            }
        }

        return {
            success:true,
            data:{
                id:user.id,
                role:'landlord'
            }
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }

        return {
            success:false,
            error:error as string | object
        }
    }
}


export const followUser = async (followedId:string,userId:string):Promise<serviceResponse>=>{
 try {
    if(!isValidUUID(followedId)){
        raiseException("invalid follower id")
    }
     if(!isValidUUID(userId)){
         raiseException("invalid user id")
     }
     const user = await db.User.findOne({where:{id:userId}});
     if(!user || user == undefined){
         return {
             success:false,
             message:serviceResponseMessages.INVALID_USER
         }
     }
    // @ts-ignore
     const isFollower = user.hasFollower(followedId);
     if(isFollower){
         return {
            success:false,
            message:serviceResponseMessages.CANNOT_FOLLOW
         }
     }
    //  @ts-ignore
     const follow = await user.addFollower(followedId);
     if(!follow){
         return {
             success:false,
             message:serviceResponseMessages.FOLLOW_ERROR
         }
     }

     return {
         success:true
     }

 } catch (error) {
    if(error instanceof Error){
        raiseException(error.message);
    }

    return {
        success:false,
        error:error as string | object
    }
 }
}

export const unfollowUser = async(followedId:string,userId:string):Promise<serviceResponse>=>{
    try {
        if(!isValidUUID(followedId)){
            raiseException("a valid followed id is required");
        }
        if(!isValidUUID(userId)){
            raiseException("invalid user id")
        }
        const user = await db.User.findOne({where:{id:userId}});
        if(!user || user == undefined){
            return {
                success:false,
                message:serviceResponseMessages.INVALID_USER
            }
        }
        // @ts-ignore
        const isFollower = await user.hasFollower(followedId);
        if(!isFollower){
            return{
                success:false,
                message: serviceResponseMessages.CANNOT_UNFOLLOW
            }
        }
        // @ts-ignore
        const unfollow = await user.removeFollower(followedId);
        if(!unfollow){
            return {
                success:false,
                message:serviceResponseMessages.UNFOLLOW_ERROR
            }
        }

        return {
            success:true
        }
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
    
        return {
            success:false,
            error:error as string | object
        }
    }
}