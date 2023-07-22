import {DataTypes,Model,Optional} from "sequelize";
import sequelize from "../config";

interface PastQuestionAttribute {
    id:number;
    fileUrl:string;
    courseCode:string;
    courseTitle:string;
    department:string;
}

export interface PastQuestionCreationAttributes extends Optional<PastQuestionAttribute, "id">{};

export class PastQuestion extends Model<PastQuestionAttribute,PastQuestionCreationAttributes> implements PastQuestionCreationAttributes{
    public id!:number;
    public fileUrl!:string;
    public courseCode!:string;
    public courseTitle!:string;
    public department!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

PastQuestion.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    fileUrl:{
        type:DataTypes.STRING,
        allowNull:false
    },
    courseCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    courseTitle:{
        type:DataTypes.STRING,
        allowNull:false
    },
    department:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    timestamps:true,
    freezeTableName:true
});
