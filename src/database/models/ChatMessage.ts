import {DataTypes,Model,Optional} from "sequelize";
import sequelize from "../config";


interface ChatMessageAttributes{
    id:number;
    message?:string;
}

export interface ChatMessageCreationAttributes extends Optional<ChatMessageAttributes, "id">{}


export class ChatMessage extends Model<ChatMessageAttributes,ChatMessageCreationAttributes> implements ChatMessageAttributes{

    public id!:number;
    public message!:string;

    public createdAt!:Date;
    public updatedAt!:Date;
}

ChatMessage.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
});

// @ts-ignore
ChatMessage.associate = (models) =>{
    ChatMessage.belongsTo(models.Chat);
}
