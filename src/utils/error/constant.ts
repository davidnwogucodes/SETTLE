export interface IApiError{
    message:string;
    statusCode:number;
}

export enum ApiErrorCode{
    BAD_REQUEST = 400,
    UNAUTHENTICATED = 401,
    UNAUTHORIZED = 403,
    NOT_FOUND = 404,
    INTERNAL = 500,
}