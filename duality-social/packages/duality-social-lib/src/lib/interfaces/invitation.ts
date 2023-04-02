import { Document } from "mongoose";
import { IHasID } from "./hasId";
import { IHasSoftDelete } from "./hasSoftDelete";
import { IHasTimestamps } from "./hasTimestamps";
import { IHasUpdates } from "./hasUpdates";
import { IUser } from "./user";

export interface IInvitationMeta extends IHasUpdates {
    uses: number;
    views: number;
}

export interface IInvitation extends IHasID, IHasTimestamps, IHasSoftDelete, Document {
    email?: string;
    phone?: string;
    code?: string;
    maxUses?: number;
    meta: IInvitationMeta;
    createdBy?: IUser['_id'];
    updatedBy?: IUser['_id'];
}

export interface IClaimedInvitation extends IHasID, Document {
    invitation: IInvitation['_id'];
    ip: string;
    email?: string;
    code?: string;
    phone?: string;
    createdAt?: Date;
}