import {DataTypes,Model,Optional} from "sequelize";
import sequelize from "../config";

interface StoryAttributes{
    id:string;
    story?:string;
    image?:string;
    likes?:number;
    isSaved?:boolean;
} 


export interface StoryCreationAttributes extends Optional<StoryAttributes,"id">{};



export class Story extends Model<StoryAttributes,StoryCreationAttributes> implements StoryAttributes{
    public id!:string;
    public story!:string;
    public image!:string;
    public likes!:number;
    public isSaved!:boolean;

    public createdAt!:Date;
    public updatedAt!:Date;
}

Story.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    story:{
        type:DataTypes.STRING,
        allowNull:false
    },
    likes:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    image:{
        type:DataTypes.STRING
    },
    isSaved:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
});

// @ts-ignore
Story.associate = (models)=>{
    Story.belongsTo(models.User);
    Story.hasOne(models.Comment);
}