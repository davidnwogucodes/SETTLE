import "dotenv/config";
import cloudinary from "cloudinary";
import multer from "multer";
import { raiseException } from "../helper";

const Cloudinary = cloudinary.v2;

Cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({});

const upload = multer({storage,
    fileFilter: (req, file, cb:any) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {

        cb(raiseException("invalid file format"),false);
        return;
      }
      cb(null, true);
    },})



export {
    Cloudinary,
    upload
}


/*
use:
route("/uploadFile",upload.single("lodge")/.array(),async(req,res,next)=>{
    const result = await Clodinary.uploader.upload(req.file.path);
})*/