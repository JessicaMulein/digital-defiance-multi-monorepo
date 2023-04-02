import { Document } from 'mongoose';
import { HumanityTypeEnum } from '../enumerations/humanityType';
import { IHasCreation } from './hasCreation';
import { IHasID } from './hasId';
import { IPost } from './post';
import { IUser } from './user';

export interface IVote extends IHasID, IHasCreation, Document {
    post: IPost['_id'];
    humanity: HumanityTypeEnum;
    createdBy: IUser['_id'];
}