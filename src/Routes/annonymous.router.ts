import {Router} from "express";
import { CreatePost,FindById,GetFeeds,Comment,UpdateComment,DeleteComment,LikePost,LikeComment,ReplyComment } from "../controllers/annonymous";

const AnnonRouter = Router();

AnnonRouter.post("/secrets/whisper",CreatePost);

AnnonRouter.get("/secrets/whisper/:id",FindById);

AnnonRouter.get("/secrets/whispers",GetFeeds);

AnnonRouter.post("/secrets/whisper/:postId/comment",Comment);

AnnonRouter.post("/secrets/whisper/comment/:commentId",UpdateComment);

AnnonRouter.delete("/secrets/whisper/comment/:commentId",DeleteComment);

AnnonRouter.post("/secrets/whisper/:postId/like",LikePost);

AnnonRouter.post("/secrets/whisper/comment/:commentId/like",LikeComment);

AnnonRouter.post("/secrets/whisper/comment/:commentId/reply",ReplyComment);

export default AnnonRouter;