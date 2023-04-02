import { Document } from "mongoose";
import { IPost } from "./post";
import { IPostImpression } from "./postImpression";

export interface IPostExpand extends Document {
    post: IPost['_id'];
    postImpression: IPostImpression['_id'];
    botExclude: boolean;
    createdAt: Date;
}