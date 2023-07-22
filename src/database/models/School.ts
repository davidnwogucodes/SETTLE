import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../config";


interface SchoolAttributes {
    id:string;
    name?:string;
    locationId?:string;
}

export interface SchoolCreationAttributes extends Optional<SchoolAttributes,"id">{}


export class School extends Model<SchoolAttributes,SchoolCreationAttributes> implements SchoolAttributes{

    public id!:string;
    public name!:string;
    public locationId!:string;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}


School.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    locationId:{
        type:DataTypes.UUID,
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
});


//@ts-ignore
School.associate = (models )=>{
    School.hasMany(models.User,{
        as:"Student"
    });
    School.belongsTo(models.Location);
    School.hasMany(models.Lodge);
}