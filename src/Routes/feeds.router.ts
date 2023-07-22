import {Router} from "express";
import {CreatePost,FindById,GetFeeds,Comment,UpdateComment,DeleteComment,LikePost,LikeComment, ReplyComment} from "../controllers/feed";


const FeedRouter = Router();

FeedRouter.post("/feed/",CreatePost);

FeedRouter.get("/feed/:id",FindById);

FeedRouter.get("/feed",GetFeeds);

FeedRouter.post("/feed/:postId/comment",Comment);

FeedRouter.post("/feed/comment/:commentId",UpdateComment);

FeedRouter.delete("/feed/comment/:commentId",DeleteComment);

FeedRouter.post("/feed/:postId/like",LikePost);

FeedRouter.post("/feed/comment/:commentId/like",LikeComment);

FeedRouter.post("/feed/comment/:commentId/reply",ReplyComment);


export default FeedRouter;