import { Document } from "mongoose";
import { ReportTypeEnum } from "../enumerations/reportType";
import { IPost } from "./post";
import { IPostViewpoint } from "./postViewpoint";
import { IUser } from "./user";

export interface IReport extends Document {
    post: IPost['_id'];
    viewpoint: IPostViewpoint['_id'];
    reportType: ReportTypeEnum;
    notes: string;
    createdBy: IUser['_id'];
    createdAt: Date;
}