import {Optional,Model,DataTypes} from "sequelize";
import sequelize from "../config";

export enum ChatTypes{
    DIRECT_MESSAGE = "direct message",
    GROUP_MESSAGE = "group message",
}

interface ChatAttributes {
    id:number;
    senderId?:string;
    type:ChatTypes;
    recipientId:string;
}

export interface ChatCreationAttributes extends Optional<ChatAttributes,"id">{};

export class Chat extends Model<ChatAttributes,ChatCreationAttributes> implements ChatAttributes{
    public id!:number;
    public senderId!:string;
    public recipientId!:string;
    public type!:ChatTypes;

    public createdAt!:Date;
    public updatedAt!:Date;
}

Chat.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    senderId:{
        type:DataTypes.UUID,
    },
    recipientId:{
        type:DataTypes.UUID
    },
    type:{
        type:DataTypes.STRING
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
});

// @ts-ignore
Chat.associate = (models) =>{
    Chat.hasMany(models.ChatMessage);
    Chat.hasOne(models.Room);
}