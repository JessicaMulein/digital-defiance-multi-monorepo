import { Document } from "mongoose";
import { IUser } from "./user";

export interface ILogin extends Document {
    user: IUser['_id'];
    ip: string;
    userAgent: string;
    createdAt: Date;
}