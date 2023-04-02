import { Schema } from 'mongoose';
import { HumanityTypeEnum } from '../enumerations/humanityType';
import { ViewpointTypeEnum } from '../enumerations/viewpointType';

export const PostViewpointSchema = new Schema(
  {
    /**
     * Correlation id to link the dualities.
     */
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      immutable: true,
    },
    /**
     * What type of entity created this post.
     */
    humanityType: {
      type: String,
      enum: HumanityTypeEnum,
      required: true,
      immutable: true,
    },
    viewpointType: {
      type: String,
      enum: ViewpointTypeEnum,
      required: true,
      immutable: true,
    },
    /**
     * The language the post is in- ISO language code, eg 'en-US' or 'en'
     */
    language: {
      type: String,
      required: true,
      immutable: true,
    },
    /**
     * Whether the content has been formatted.
     */
    formatted: {
      type: Boolean,
      required: true,
      default: false,
      immutable: true,
    },
    /**
     * The id of the parent viewpoint if this is a reply.
     */
    parentViewpoint: {
      type: Schema.Types.ObjectId,
      ref: 'PostViewpoint',
      optional: true,
      immutable: true,
    },
    /**
     * The actual content.
     */
    content: { type: String, required: true, immutable: true },
    /**
     * Whether the content has been pre-rendered.
     */
    contentRendered: { type: String, required: true },
    /**
     * Whether the content is a translation.
     */
    translation: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, optional: true },
    deletedAt: { type: Date, optional: true },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
      immutable: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
    meta: {
      expands: Number,
      impressions: Number,
      reactions: Number,
    },
  },
  { timestamps: true }
);
