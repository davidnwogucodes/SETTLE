import {Router} from "express";
import { AddLodge,FindById,FindByName,UpdateLodge,GetLodges } from "../controllers/accomodation";
import { auth } from "../middlewares";

const LodgeRouter = Router();

LodgeRouter.post("/accomodation/lodge",auth,AddLodge);

LodgeRouter.get("/accomodation/lodge/:id",auth,FindById);

LodgeRouter.get("accomodation/lodge/",auth,FindByName);

LodgeRouter.put("accomodation/lodge/:id",auth,UpdateLodge);

LodgeRouter.get("accomodation/lodges",auth,GetLodges);

export default LodgeRouter;