import { DataTypes,Optional,Model } from "sequelize";
import sequelize from "../config";

interface WishlistAttributes{
    id:number;
}

export interface WishlistCreationAttributes extends Optional<WishlistAttributes, "id">{}

export class Wishlist extends Model<WishlistAttributes, WishlistCreationAttributes> implements WishlistAttributes{
    public id!:number;

    public createdAt!: Date;
    public updatedAt!:Date;
}

Wishlist.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    }
},{
    sequelize,freezeTableName:true,timestamps:true
})

// @ts-ignore
Wishlist.associate = (models)=>{
    Wishlist.belongsTo(models.User);
    Wishlist.belongsTo(models.Lodge);
}