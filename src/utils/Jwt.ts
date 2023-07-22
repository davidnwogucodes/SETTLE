import "dotenv/config";
import { Request } from "express";
import { verify,sign, Secret } from "jsonwebtoken";
import { roles } from "../database/models/Roles";
import { isExistUser, isValidString, isValidUUID, raiseException } from "./helper";

interface Tokens {
    accessToken:string;
    refreshToken:string;
}

interface jwtPayload{
    userId:string;
    role: roles;
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as Secret;
const accessTokenValidity = parseInt(process.env.ACCESS_TOKEN_VALIDITY as string);
const refreshTokenValidity = parseInt(process.env.REFRESH_TOKEN_VALIDITY as string);

export const assignTokens = (userId:string,role?:string):Tokens=>{
try {
    let userRole:string;
    switch (role) {
        case roles.STUDENT:
            userRole = roles.STUDENT;
            break;
        case roles.LANDLORD:
            userRole = roles.LANDLORD;
            break;
        case roles.ADMIN:
            userRole = roles.ADMIN;
            break;
        default:
            userRole = "";
            break;
    }
    const accessToken = sign({userId,role:userRole},accessTokenSecret,{expiresIn:accessTokenValidity});
    const refreshToken = sign({userId,role:userRole},refreshTokenSecret,{expiresIn:refreshTokenValidity});

    return { accessToken,refreshToken };
} catch (error) {
throw new Error((error as Error).message);
}
}

export const decodeAccessToken = (token:string):jwtPayload|null=>{
    try {
        const payload = verify(token,accessTokenSecret);
        if(!payload || typeof payload !== "object"){
            return null;
        }
        return payload as jwtPayload;
    } catch (error) {
        if((error as Error).message == "jwt expired"){
            return null;
        }
        throw new Error((error as Error).message);
    }
}


export const hasTokenHeader = (req:Request):boolean=>{
    try {
        return req.headers['Authorization']?true:false;
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return false;
    }
}

//used to check if a request has a token and its payload is of a valid user.
export const isAuth = async (req:Request):Promise<boolean>=>{
    try {
        if(!hasTokenHeader(req)){
            return false;
        }
        const jwtToken:string = req.headers['x-access-token']!.toString();
        const data = decodeAccessToken(jwtToken);
        if(data == null){
            return false;
        }
        if(!isValidString(data.userId)){
            return false;
        }
        if(!isValidUUID(data.userId)){
            return false;
        }
        return await isExistUser(data.userId);
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        return false;
    }
}

export const decodeRefreshToken = (token:string):jwtPayload|null =>{
    try {
       return verify(token,refreshTokenSecret) as jwtPayload;
    } catch (error) {
        if((error as Error).message == "jwt expired"){
            return null;
        }
        throw new Error((error as Error).message);
    }
}


export const refreshTokens = (refreshToken:string):Tokens|null=>{
    try {
        const payload = decodeRefreshToken(refreshToken);
        if(payload == null){
            return null;
        }
        const {userId,role}:jwtPayload = payload;
        return assignTokens(userId,role);
    } catch (error) {
        if(error instanceof Error){
            raiseException(error.message);
        }
        throw new Error((error as Error).message);
    }
}


