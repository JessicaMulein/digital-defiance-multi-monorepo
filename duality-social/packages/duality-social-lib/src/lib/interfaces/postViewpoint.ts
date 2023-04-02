import { Document } from 'mongoose';
import { HumanityTypeEnum } from '../enumerations/humanityType';
import { ViewpointTypeEnum } from '../enumerations/viewpointType';
import { IHasID } from './hasId';
import { IHasSoftDelete } from './hasSoftDelete';
import { IHasTimestamps } from './hasTimestamps';
import { IPost } from './post';
import { IUser } from './user';


export interface IPostViewpointMeta {
  expands: number;
  impressions: number;
  reactions:  number;
  reactionsByType: { [key: string]: number };
}

export interface IPostViewpoint extends IHasID, IHasTimestamps, IHasSoftDelete, Document {
  /**
   * Correlation id to link the dualities.
   */
  post: IPost['_id'];
  /**
   * What type of entity created this post.
   */
  humanityType: HumanityTypeEnum;
  /**
   * The raw content of the viewpoint.
   */
  content: string;
  /**
   * Pre-rendered content of the viewpoint.
   */
  contentRendered: string;
  /**
   * Whether the content is a translation.
   */
  translation: boolean;
  /**
   * The language of the content.
   */
  language: string;
  /**
   * The id of the parent viewpoint if this is a reply.
   */
  parentViewpoint?: IPostViewpoint['_id'];
  createdBy: IUser['_id'];
  updatedBy: IUser['_id'];
  meta: IPostViewpointMeta;
}