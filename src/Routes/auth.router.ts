import { Router } from "express";
import { Login,Signup,ResendConfirmationCode, ConfirmUser,Follow,UnFollow } from "../controllers/auth";
import { auth } from "../middlewares";

const AuthRouter = Router();


AuthRouter.post("/auth/signup",Signup);

AuthRouter.post("/auth/login",Login);

AuthRouter.post("/auth/confirm/resend",ResendConfirmationCode);

AuthRouter.get("/auth/confirm/user",auth,ConfirmUser);

AuthRouter.post("/follow/user/:followedId",Follow);

AuthRouter.post("/unfollow/user/:followedId",UnFollow);


export default AuthRouter;