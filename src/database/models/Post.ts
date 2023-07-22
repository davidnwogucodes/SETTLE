import {DataTypes,Optional,Model} from "sequelize";
import sequelize from "../config";


interface PostAttributes {
    id:number;
    imageUrl?:string;
    content?:string;
    likes?:number;
    likers?:string;
}

export interface PostCreationAttributes extends Optional<PostAttributes, "id">{};

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes{
    public id!:number;
    public imageUrl!:string;
    public content!:string;
    public likes!:number;
    public likers!:string;

    public createdAt!:Date;
    public updatedAt!:Date;
}

Post.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true,
        autoIncrement:true
    },
    imageUrl:{
        type:DataTypes.STRING,
    },
    content:{
        type:DataTypes.STRING
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
})

// @ts-ignore
Post.associate = (models)=>{
    Post.belongsTo(models.User);
    Post.hasMany(models.Comment);
}