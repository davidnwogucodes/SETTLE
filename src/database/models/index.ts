import { User } from "./User";
import { Location } from "./Location";
import {Lodge} from "./Lodge";
import {Review} from "./Review";
import {School} from "./School";
import { Landlord } from "./Landlord";
import { Admin } from "./Admin";
import { Role } from "./Roles";
import sequelize from "../config";
import { Sequelize } from "sequelize";
import { Chat } from "./Chat";
import { ChatMessage } from "./ChatMessage";
import { Room } from "./Rooms";
import { Wishlist } from "./Wishlist";
import { Image } from "./Image";
import { Comment } from "./Comment";
import { Story } from "./Story";
import { Subscription } from "./Subscribtion";
import { PastQuestion } from "./PastQuestion";
import { Post } from "./Post";


const models = {
    School,User,Landlord,Review,Lodge,Location,Admin,Role,Chat,ChatMessage,Room,Wishlist,Image,Comment,Story,Subscription,PastQuestion,Post
}


Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

const db = {
    ...models,sequelize,Sequelize
}

export default db;