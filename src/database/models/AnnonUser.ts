import {Optional,Model,DataTypes} from "sequelize";
import sequelize from "../config";


interface AnnonUserAttributes{
    id:number;
    annonId:string;
}


export interface AnnonUserCreationAttributes extends Optional<AnnonUserAttributes,"id">{};


export class AnnonUser extends Model<AnnonUserAttributes,AnnonUserCreationAttributes> implements AnnonUserAttributes{

    public id!:number;
    public annonId!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

AnnonUser.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
    },
    annonId:{
        type:DataTypes.STRING,
        unique:true,
    }
},{
    sequelize,
    timestamps:true,
    freezeTableName:true
});

// @ts-ignore
AnnonUser.associate = (models)=>{
    AnnonUser.hasMany(models.AnnonPost);
    AnnonUser.hasMany(models.AnnonComment);
}