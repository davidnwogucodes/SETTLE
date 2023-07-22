import {Router,Request,Response,NextFunction} from "express"
import { CreateResource,UpdateResource,FindById,GetAll,DeleteResource } from "../controllers/studentMaterials";
import {CreateBook,FindById as FindBookById,GetAll as GetAllBooks,UpdateBook,FindByName,FindByCategory,DeleteBook} from "../controllers/book";

const ResourceRouter = Router();

ResourceRouter.post("/resource/students/pastquestion",CreateResource);

ResourceRouter.post("/resource/students/pastquestion/:id",UpdateResource);

ResourceRouter.get("/resource/students/pastquestions",GetAll);

ResourceRouter.get("/resource/students/pastquestion/:id",FindById);

ResourceRouter.delete("/resource/students/pastquestion/:id",DeleteResource);

ResourceRouter.post("/resource/book",CreateBook);

ResourceRouter.get("/resource/book/:bookId",FindBookById);

ResourceRouter.get("/resource/books",GetAllBooks);

ResourceRouter.post("/resource/book/:bookId",UpdateBook);

ResourceRouter.get("/resource/book",(req:Request,res:Response,next:NextFunction)=>{
    if(req.query.name){
        return FindByName(req,res,next);
    }else if(req.query.category){
        return FindByCategory(req,res,next)
    }else{
        return res.sendStatus(404);
    }
})

ResourceRouter.delete("/resource/book/:bookId",DeleteBook);


export default ResourceRouter;