import { DataTypes,Model,Optional } from "sequelize";
import sequelize from "../config";

interface UserAttributes{
    id:string;
    firstname:string;
    lastname:string;
    email?:string;
    password?:string;
    profileImage?:string;
    phone?:string;
    gender?:string;
    googleId?:string;
    verificationCode?:number;
    verificationCodeValidity?:number|Date;
    coins?:number;
    isVerified?:boolean;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id">{}


export class User extends Model<UserAttributes,UserCreationAttributes> implements UserAttributes{
 public id!:string;
 public firstname!:string;
 public lastname!:string;
 public email!:string;
 public password!:string;
 public profileImage?:string;
 public gender!:string;
 public googleId!:string;
 public isVerified!:boolean;
 public verificationCode!:number;
 public verificationCodeValidity!:number|Date;
 public coins!:number;
 public phone!:string;

 public readonly createdAt!: Date;
 public readonly updatedAt!: Date;

}

User.init({
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        allowNull:false,
        defaultValue:DataTypes.UUIDV4,
        unique:true
    },
    firstname:{
        type:  DataTypes.STRING(128),
        allowNull:false
    },
    lastname:{
        type: DataTypes.STRING(128),
        allowNull:false
    },
    email:{
        type: DataTypes.STRING(128),
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING
    },
    profileImage:{
        type:DataTypes.STRING
    },
    gender:{
        type:DataTypes.STRING,
    },
    isVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    verificationCode:{
        type:DataTypes.INTEGER
    },
    verificationCodeValidity:{
        type:DataTypes.DATE
    },
    googleId:{
        unique:true,
        type: DataTypes.STRING(128),
    },
    phone:{
        type: DataTypes.STRING(128),
        unique:true
    },
    coins:{
        type:DataTypes.INTEGER
    }
},{
    timestamps:true,
    freezeTableName:true,
    sequelize
})

//@ts-ignore
User.associate = (models)=>{
    User.belongsTo(models.School,{
        as:"Student"
    });

    User.hasMany(models.Post);

    User.hasMany(models.Review);

    User.hasOne(models.Landlord);
    //follower
    User.belongsToMany(models.User,{
        as:"following",
        through:"follow",
        foreignKey:"followerId",
        otherKey:"followedId"
    });
    //followed
    User.belongsToMany(models.User,{
        as:"followers",
        foreignKey:"followedId",
        otherKey:"followerId",
        through:"follow",
    });
    User.hasOne(models.Admin);
    User.belongsToMany(models.Role,{
        through:"userRole"
    });
    User.belongsToMany(models.Room,{
        through:'RoomMembers'
    });
    User.hasOne(models.Wishlist);
    User.hasMany(models.Story);
    User.hasOne(models.Comment);
    User.hasOne(models.Subscription);
}