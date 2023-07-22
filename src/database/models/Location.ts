import sequelize from "../config";
import {DataTypes,Model,Optional,Op} from 'sequelize';


interface LocationAttributes{
    id:string;
    name?:string;
    long?:string;
    lat?:string;
}

export interface LocationCreationAttributes extends Optional<LocationAttributes,"id">{}


export class Location extends Model<LocationAttributes,LocationCreationAttributes> implements LocationCreationAttributes{
public id!:string;
public name!:string;
public long!:string;
public lat!:string;

public readonly createdAt!: Date;
public readonly updatedAt!: Date;


static async getByName(name:string):Promise<Location[]|Location|null>{
    try {
        return await this.findAll({where:{
            name: {[Op.like]:`%${name}%`}
        }});
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

static async getLocation(long:string,lat:string):Promise<Location|null>{
    try {
        return await this.findOne({where:{long,lat},attributes:["name"]});
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

}

Location.init({
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        unique:true
    },
    name:{
        type:DataTypes.STRING(128),
        allowNull:false,
    },
    lat:{
        type:DataTypes.STRING,
        allowNull:false
    },
    long:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    freezeTableName:true,
    timestamps:true
});

//@ts-ignore
Location.associate = (models)=>{
    Location.hasMany(models.School);
}