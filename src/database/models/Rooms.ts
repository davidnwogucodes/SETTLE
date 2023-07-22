import {DataTypes,Optional,Model} from "sequelize";
import sequelize from "../config";



interface RoomAttributes{
    id:number;
    name:string;
}

export interface RoomCreationAttributes extends Optional<RoomAttributes, "id">{};


export class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes{
    public id!:number;
    public name!:string;

    public createdAt!:Date;
    public updatedAt!:Date;
}


Room.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
});

// @ts-ignore
Room.associate = (models) =>{
    Room.belongsToMany(models.User,{
        through:"RoomMembers",
    });
    Room.belongsTo(models.Chat)
}
