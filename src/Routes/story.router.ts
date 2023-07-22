import { CreateStory,FindById,GetAllStories,FindByUser,SaveStory } from "../controllers/userStory";
import {Router} from "express";
import { auth } from "../middlewares";

const StoryRouter = Router();

StoryRouter.post("/story/create",auth,CreateStory);

StoryRouter.get("/story/:id",auth,FindById);

StoryRouter.post("/story/:storyId/save",auth,SaveStory);

StoryRouter.get("/story/stories",auth,GetAllStories);

StoryRouter.get("/story/stories",auth,FindByUser);





export default StoryRouter;