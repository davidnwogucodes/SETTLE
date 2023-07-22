import { DataTypes,Model,Optional} from "sequelize";
import sequelize from "../config";


interface LodgeAttributes{
    id:string;
    name?:string;
    rooms?:number;
}

export interface LodgeCreationAttributes extends Optional<LodgeAttributes, "id">{};



export class Lodge extends Model<LodgeAttributes,LodgeCreationAttributes> implements LodgeAttributes{
public id!:string;
public name!:string;
public rooms!:number;

public readonly createdAt!:Date;
public readonly updatedAt!:Date;

}

Lodge.init({
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4,
        unique:true
    },
    name:{
        type:DataTypes.STRING(128),
        allowNull:false
    },
    rooms:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    timestamps:true,
    sequelize,
    freezeTableName:true,
});


//@ts-ignore
Lodge.associate = (models)=>{
    Lodge.belongsTo(models.School);
    Lodge.belongsTo(models.Landlord);
    Lodge.hasMany(models.Review);
    Lodge.hasOne(models.Wishlist);
    Lodge.hasMany(models.Image);
}