import sequelize from "../config";
import { DataTypes,Model,Optional } from "sequelize";

interface LandlordAttributes {
    id:string;
    isActive?:boolean;
}

export interface LandlordCreationAttributes extends Optional<LandlordAttributes, "id">{};

export class Landlord extends Model<LandlordAttributes,LandlordCreationAttributes> implements LandlordAttributes{
    public id!:string;
    public isActive!:boolean;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Landlord.init({
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        unique:true,
        defaultValue:DataTypes.UUIDV4
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
},{
    sequelize,
    timestamps:true,
    freezeTableName:true
});


//@ts-ignore
Landlord.associate = (models) =>{
    Landlord.hasMany(models.Lodge);
    Landlord.belongsTo(models.User);
}