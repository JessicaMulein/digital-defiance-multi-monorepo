import { Document } from "mongoose";
import { IAdminUser } from "./adminUser";
import { IUser } from "./user";

export interface ISudoLog extends Document {
    user: IUser['_id'];
    adminUser: IAdminUser['_id'];
    success: boolean;
    createdAt: Date;
    createdBy: IUser['_id'];
}