import { Model,DataTypes,Optional } from "sequelize";
import sequelize from "../config";


interface ReviewAttributes{
    id:string;
    review?:string;
    rating?:number;
    lodgeId?:string;
}


export interface ReviewCreationAttributes extends Optional<ReviewAttributes , "id">{}


export class Review extends Model<ReviewAttributes,ReviewCreationAttributes> implements ReviewAttributes{
    public id!:string;
    public review!:string;
    public rating!:number;
    public lodgeId!:string;


    public readonly createdAt!:Date;
    public readonly updatedAt!:Date;
}

Review.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
        unique:true,
        allowNull:false
    },
    review:{
        type: DataTypes.STRING,
    },
    rating:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    lodgeId:{
        type:DataTypes.UUID,
        allowNull:false
    }
},{
    timestamps:true,
    sequelize,
    freezeTableName:true
});

//@ts-ignore
Review.associate = (models)=>{
    Review.belongsTo(models.User);
    Review.belongsTo(models.Lodge);
}