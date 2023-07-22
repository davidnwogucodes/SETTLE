import {Model,Optional,DataTypes} from "sequelize";
import sequelize from "../config";

interface ImageAttributes{
    id:number;
    url?:string;
}

export interface ImageCreationAttributes extends Optional<ImageAttributes,"id">{};


export class Image extends Model<ImageAttributes,ImageCreationAttributes> implements ImageAttributes{
    public id!:number;
    public url!:string;

    public createdAt!:Date;
    public updatedAt!:Date;
}

Image.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        unique:true
    },
    url:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    timestamps:true,
    freezeTableName:true
})

// @ts-ignore
Image.associate = (models)=>{
    Image.belongsTo(models.Lodge);
}