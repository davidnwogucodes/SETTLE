import {Optional,Model,DataTypes} from "sequelize";
import sequelize from "../config";


interface AnnonPostAttributes{
    id:number;
    content:string;
    imageUrl?:string;
    likes?:number;
    likers?:string;
}


export interface AnnonPostCreationAttributes extends Optional<AnnonPostAttributes,"id">{};


export class AnnonPost extends Model<AnnonPostAttributes,AnnonPostCreationAttributes> implements AnnonPostAttributes{

    public id!:number;
    public content!:string;
    public imageUrl!:string
    public likes!:number;
    public likers!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

AnnonPost.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
    },
    content:{
        type:DataTypes.STRING,
        unique:true,
    },
    imageUrl:{
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
    timestamps:true,
    freezeTableName:true
});

// @ts-ignore
AnnonPost.associate = (models)=>{
    AnnonPost.belongsTo(models.AnnonUser);
    AnnonPost.hasMany(models.AnnonComment);
}