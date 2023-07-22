import {Request,Response,NextFunction} from "express"
import ApiError from "../utils/error/ApiError";
import { decodeAccessToken, decodeRefreshToken } from "../utils/Jwt";

export const auth = async (req:Request,_:Response,next:NextFunction):Promise<void>=>{
    try {
        const accessToken = (req.headers["Authorization"] as string)?.split("")[1];
        if(accessToken == undefined){
            next(ApiError.unauthenticated());
        }
        if(accessToken == null){
            const refreshToken = (req.headers['x-refresh-token'] as string);
            const payload = decodeRefreshToken(refreshToken);
            if(payload == null){
                next(ApiError.unauthenticated());
            }
            // @ts-ignore
            req.userId = payload.userId;
        }
        const payload = decodeAccessToken(accessToken);
        // @ts-ignore
        req.userId = payload.userId || null;
        next();
    } catch (error) {
        next(error)
    }
}