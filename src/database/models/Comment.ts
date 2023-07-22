import {DataTypes,Model,Optional} from "sequelize";
import sequelize from "../config";

interface CommentAttributes{
    id:string;
    comment?:string;
    isReply?:boolean;
    commentToReplyId?:string;
    likes?:number;
    likers?:string;
} 


export interface CommentCreationAttributes extends Optional<CommentAttributes,"id">{};



export class Comment extends Model<CommentAttributes,CommentCreationAttributes> implements CommentAttributes{
    public id!:string;
    public comment!:string;
    public isReply!:boolean;
    public likes!:number;
    public likers!:string;

    public createdAt!:Date;
    public updatedAt!:Date;
}

Comment.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    comment:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isReply:{
        type:DataTypes.BOOLEAN
    },
    likes:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    likers:{
        type:DataTypes.STRING,
        defaultValue:JSON.stringify([]),
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
});

// @ts-ignore
Comment.associate = (models)=>{
    Comment.belongsTo(models.User);
    Comment.belongsTo(models.Post);
    Comment.belongsTo(models.Comment,{
        as:"reply"
    })
    Comment.hasMany(models.Comment)
}