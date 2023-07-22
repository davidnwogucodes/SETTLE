import {config as Config} from "dotenv";
import {resolve} from "path"
import Redis,{RedisOptions} from "ioredis";

if(process.env.NODE_ENV !== "production"){
    Config({path:resolve(__dirname,"../../../.env")})
}

const config:RedisOptions = {
    port: parseInt(process.env.REDIS_PORT!),
    password:process.env.REDIS_PASSWORD,
    host:process.env.REDIS_HOST,
    family:4,
}

 class CacheStore{

    private _client:Redis.Redis;
    constructor(){
        this._client = new Redis(config);
    }
    async getItem(key:string){
        return await this._client.get(key);
    }

    async setItem(key:string,value:any){
        return await this._client.set(key,value);
    }

    async delete(key:string){
        return await this._client.del(key);
    }
}

export default new CacheStore();

