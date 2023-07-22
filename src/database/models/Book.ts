import {Model,Optional,DataTypes} from "sequelize";
import sequelize from "../config";

interface BookAttributes{
    id:number;
    name?:string
    category?:string;
    file?:string;
}


export interface BookCreationAttributes extends Optional<BookAttributes,"id">{};

export class Book extends Model<BookAttributes,BookCreationAttributes> implements BookAttributes{
    public id!:number;
    public name!:string;
    public category!:string;
    public file!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
};


Book.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        unique:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
    },
    file:{
        type:DataTypes.STRING
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
});