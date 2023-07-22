import AuthRouter from "./auth.router";
import StoryRouter from "./story.router";
import LodgeRouter from "./accomodation.router";
import FeedRouter from "./feeds.router";
import ResourceRouter from "./studentresource.router";


exports = {
    ...AuthRouter,
    ...StoryRouter,
    ...LodgeRouter,
    ...FeedRouter,
    ...ResourceRouter
}