import { Document } from 'mongoose';
import { DefaultReactionsTypeEnum } from '../enumerations/defaultReactionsType';
import { ReactionTypeEnum } from '../enumerations/reactionType';
import { IHasCreation } from './hasCreation';
import { IHasID } from './hasId';
import { IPostViewpoint } from './postViewpoint';
import { IUser } from './user';

export interface IReaction extends IHasID, IHasCreation, Document {
    /**
     * The viewpoint that the reaction is on.
     */
    viewpoint: IPostViewpoint['_id'];
    /**
     * Whether the reaction is a builtin, emoji, fontawesome, or material reaction.
     */
    type: ReactionTypeEnum;
    /**
     * The built-in reaction that was made.
     */
    reaction?: DefaultReactionsTypeEnum;
    /**
     * The emoji reaction that was made.
     */
    emojiReaction?: string;
    /**
     * The fontawesome reaction that was made.
     */
    fontAwesomeReaction?: string;
    /**
     * The user who created the reaction/reacted.
     */
    createdBy: IUser['_id'];
}