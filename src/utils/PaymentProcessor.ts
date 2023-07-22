import "dotenv/config";
import { raiseException } from "./helper";
//gateway/client,
const Flutterwave = require("flutterwave-node-v3");
const APP_KEY = process.env.FLUTTER_WAVE_PUBLIC_KEY as string;
const APP_SECRET = process.env.FLUTTER_WAVE_SECRET_KEY as string;

interface paymentSeviceResponse{
    ok:boolean;
    message?:string;
    data?:any;
    error?:string|object;
}

/* PACKAGES:
    freemium,premium
*/
export default class PaymentProcessor{
    private readonly _paymentEngine = new Flutterwave(APP_KEY,APP_SECRET);
    // constructor(){
    //     this._paymentEngine = 
    // }

     async SubscribeStudent():Promise<paymentSeviceResponse>{
        try {
            // this._paymentEngine
            return {
                ok:true
            };
        } catch (error) {
            if(error instanceof Error){
                raiseException(error.message)
            }
            return {
                ok:false,
                error: error as string|object
            }
        }
    }

     async SubscribeLandlord():Promise<paymentSeviceResponse>{
        try {
            return {
                ok:true
            };
        } catch (error) {
            if(error instanceof Error){
                raiseException(error.message)
            }
            return {
                ok:false,
                error: error as string|object
            }
        }
    }
}