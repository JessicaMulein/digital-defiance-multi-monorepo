import {  Schema } from 'mongoose';
import { BaseModelCaches } from '../models/schema';
/**
 * Toplevel object represents a post with its two viewpoints
 */
export const PostSchema = new Schema(
  {
    /**
     * The id of the parent post if this is a reply.
     */
    parentPost: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      optional: true,
      default: null,
      readonly: true,
    },
    inputViewpoint: {
      type: Schema.Types.ObjectId,
      ref: 'PostViewpoint',
      optional: true,
      required: false,
    },
    inputViewpointTranslations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PostViewpoint',
        required: true,
      },
    ],
    aiViewpoint: {
      type: Schema.Types.ObjectId,
      ref: 'PostViewpoint',
      required: false,
      optional: true,
    },
    aiViewpointTranslations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PostViewpoint',
        required: true,
      },
    ],
    imageUrls: [{ type: String, required: true }],
    hidden: { type: Boolean, default: false, required: true },
    deletedAt: { type: Date, optional: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    meta: {
      expands: Number,
      impressions: Number,
      reactions: Number,
    },
  },
  { timestamps: true }
);
