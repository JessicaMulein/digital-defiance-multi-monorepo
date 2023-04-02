import { Document } from "mongoose";
import { IPost } from "./post";

export class OpenAiTask extends Document {
    public readonly createdAt: Date = new Date();
    public completedAt?: Date;
    public post?: IPost['_id'];
}