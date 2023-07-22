import "dotenv/config";
import { raiseException } from "./helper";
import { Twilio } from "twilio";

 class Sms{

    private _authToken:string = process.env.TWILIO_AUTH_TOKEN as string;
    private _accountSid:string = process.env.TWILIO_ACCOUNT_SID as string;
    private _client = new Twilio(this._accountSid,this._authToken);

 async sendVerificationCode(phone:string,code:number):Promise<boolean>{
        try {
            const isSmsSent = await this._client.messages.create({
                body:`Your Settle App verification code is ${code}`,
                from:process.env.TWILIO_NUMBER,
                to:phone,
            });

            if(!isSmsSent) return false;

                return true;
        } catch (error) {
            if(error instanceof Error){
                raiseException(error.message)
            }
            console.log(error);
            throw new Error("sms error");
        }
    }

    async sendPassword(phone:string,code:number):Promise<boolean>{
        try {
            const isSmsSent = await this._client.messages.create({
                body:`Your new password is ${code}, you can change it later`,
                from:process.env.TWILIO_NUMBER,
                to:phone,
            });

            if(!isSmsSent) return false;

                return true;
        } catch (error) {
            if(error instanceof Error){
                raiseException(error.message)
            }
            console.log(error);
            throw new Error((error as Error).message);
        }
    }

}

export default new Sms();




