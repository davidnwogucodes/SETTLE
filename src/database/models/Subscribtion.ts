import {Model,Optional,DataTypes} from "sequelize";
import sequelize from "../config";

interface SubscriptionAttributes{
    id:number;
    validity:number;
}

export interface SubscriptionCreatinAttributes extends Optional<SubscriptionAttributes, "id">{};

export class Subscription extends Model<SubscriptionAttributes,SubscriptionCreatinAttributes> implements SubscriptionAttributes{
    public id!:number;
    public validity!:number;

    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Subscription.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        unique:true,
        primaryKey:true,
        allowNull:false
    },
    validity:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    sequelize,
    timestamps:true,
    freezeTableName:true
});

// @ts-ignore
Subscription.associate = (models)=>{
    Subscription.belongsTo(models.User);
}