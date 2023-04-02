import { Document } from "mongoose";
import { IPost } from "./post";
import { IUser } from "./user";

export interface IPostImpression extends Document {
    post: IPost['_id'];
    user: IUser['_id'];
    ip: string;
    botExclude: boolean;
    createdAt: Date;
}