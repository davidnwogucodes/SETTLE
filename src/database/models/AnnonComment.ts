import {DataTypes,Model,Optional} from "sequelize";
import sequelize from "../config";

interface AnnonCommentAttributes{
    id:string;
    comment?:string;
    isReply?:boolean;
    commentToReplyId?:string;
    likes?:number;
    likers?:string;
} 


export interface AnnonCommentCreationAttributes extends Optional<AnnonCommentAttributes,"id">{};



export class AnnonComment extends Model<AnnonCommentAttributes,AnnonCommentCreationAttributes> implements AnnonCommentAttributes{
    public id!:string;
    public comment!:string;
    public isReply!:boolean;
    public likes!:number;
    public likers!:string;

    public createdAt!:Date;
    public updatedAt!:Date;
}

AnnonComment.init({
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
AnnonComment.associate = (models)=>{
    AnnonComment.belongsTo(models.AnnonUser);
    AnnonComment.belongsTo(models.AnnonPost);
    AnnonComment.belongsTo(models.AnnonComment,{
        as:"reply"
    })
    AnnonComment.hasMany(models.Comment)
}