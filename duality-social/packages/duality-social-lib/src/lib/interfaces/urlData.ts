import { Document } from "mongoose";

export interface IUrlData extends Document {
    domain: string;
    url: string;
}