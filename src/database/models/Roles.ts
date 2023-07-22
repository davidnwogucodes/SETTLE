import { DataTypes,Optional,Model } from "sequelize";
import sequelize from "../config";

export enum roles {
    USER = "user",
    STUDENT = "student",
    ADMIN = "admin",
    LANDLORD = "landlord",
}

interface RoleAttribute{
    id:number;
    role?:roles
}

export interface RoleCreationAttribute extends Optional<RoleAttribute, "id">{};

export class Role extends Model<RoleAttribute,RoleCreationAttribute> implements RoleAttribute{
    public id!:number;
    public role!:roles;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Role.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    role:{
        type:DataTypes.STRING,
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
});

//@ts-ignore
Role.associate = (models) =>{
    Role.belongsToMany(models.User,{
        through:"userRole",
    })
}