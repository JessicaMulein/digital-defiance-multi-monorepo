import { Document } from 'mongoose';
import { IHasDeleter } from './hasDeleter';
import { IHasID } from './hasId';
import { IHasSoftDelete } from './hasSoftDelete';
import { IHasTimestampOwners } from './hasTimestampOwners';
import { IHasTimestamps } from './hasTimestamps';
import { IPostViewpoint } from './postViewpoint';

export interface IPostMeta {
    expands: number,
    impressions: number,
    reactions: number,
    reactionsByType: { [key: string]: number };
}

/**
 * This interface represents a post, which is a piece of content that a user can create.
 * One post will consist of a minimum of two viewpoints- one from the user and one from the AI.
 * There may be additional "viewpoints" that are AI translations of either of the other viewpoints.
 * There is no point in keeping both source and rendered copies of translations, so we only keep rendered translations.
 * Source - Human
 * Rendered - Human
 * Source - AI
 * Rendered - AI
 * Rendered - AI Translation
 * It inherits from IHasID, which provides the id property, IHasCreation, which provides the createdAt and updatedAt properties, and IHasSoftDelete, which provides the deletedAt property.
 */
export interface IPost extends IHasID, IHasTimestamps, IHasSoftDelete, IHasTimestampOwners, IHasDeleter, Document {
    // graphql fields

    // duality social specific fields
    /**
     * The id of the parent post if this is a reply.
     */
    parent?: IPost['_id'];
    /**
     * Tree of parentIDs
     */
    parents: IPost['_id'][];
    /**
     * The id of the viewpoint that this viewpoint is a reply to.
     */
    inReplyToViewpoint?: IPostViewpoint['_id'];
    /**
     * Tree of viewpoint parents
     */
    viewpointParents: IPostViewpoint['_id'][];
    /**
     * The id of the viewpoint that the user inputted.
     */
    inputViewpoint?: IPostViewpoint['_id'];
    /**
     * The id of the viewpoint that the AI generated.
     */
    aiViewpoint?: IPostViewpoint['_id'];
    /**
     * URLs of embedded images
     */
    imageUrls: string[];
    //metadata
    meta: IPostMeta;
}

export type PostKeys = { [P in keyof IPost]: P; }[keyof IPost];