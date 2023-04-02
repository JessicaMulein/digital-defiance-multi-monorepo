import { Document } from "mongoose";
import { IPost } from "./post";
import { IPostViewpoint } from "./postViewpoint";
import { IUser } from "./user";

export interface IViewpointReaction extends Document {
    post: IPost['_id'];
    viewpoint: IPostViewpoint['_id'];
    reaction: string;
    createdBy: IUser['_id'];
    hidden: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}