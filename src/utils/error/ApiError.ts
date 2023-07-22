import { ApiErrorCode,IApiError } from "./constant";

export default class ApiError extends Error implements IApiError{
    constructor(public message:string,public statusCode:number){
        super(message)
        Error.captureStackTrace(this,ApiError);
    }

    static badRequest():ApiError{
        return new ApiError("bad request",ApiErrorCode.BAD_REQUEST)
    }

    static unauthenticated():ApiError{
        return new ApiError("user unauthenticated",ApiErrorCode.UNAUTHENTICATED)
    }

    static unauthorized():ApiError{
        return new ApiError("request unauthorized",ApiErrorCode.UNAUTHORIZED)
    }

    static notFound():ApiError{
        return new ApiError("resource not found",ApiErrorCode.NOT_FOUND)
    }

    static serverError():ApiError{
        return new ApiError("internal server error",ApiErrorCode.INTERNAL)
    }
}

