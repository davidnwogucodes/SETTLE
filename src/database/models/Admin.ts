import { DataTypes,Model,Optional } from "sequelize";
import sequelize from "../config";


interface AdminAttributes {
    id:string;
    level?:number;
}


export interface AdminCreationAttributes extends Optional<AdminAttributes, "id">{}

export class Admin extends Model<AdminAttributes,AdminCreationAttributes> implements AdminAttributes{
    public id!:string;
    public level!:number;

    public createdAt!:Date;
    public updatedAt!:Date;
}

Admin.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    level:{
        type:DataTypes.INTEGER,
        defaultValue:1
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
})

//@ts-ignore
Admin.associate = (models)=>{
    Admin.belongsTo(models.User);
}