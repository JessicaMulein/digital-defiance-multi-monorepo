import { Schema } from 'mongoose';
import { BaseModelCaches } from '../models/schema';
export const ViewpointReactionSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      unique: true,
      immutable: true,
    },
    viewpoint: {
      type: Schema.Types.ObjectId,
      ref: 'PostViewpoint',
      required: true,
      unique: true,
      immutable: true,
    },
    reaction: { type: String, required: true, immutable: true },
    /**
     * The id of the user that created this reaction.
     */
    ceatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      immutable: true,
    },
    /**
     * Whether this reaction has been hidden from the statistics and reaction lists.
     * This could be used to exclude reactions from bots or other situations.
     */
    hidden: { type: Boolean, default: true, required: true },
    /**
     * Whether this reaction has been deleted.
     */
    deletedAt: { type: Date, required: false, optional: true },
  },
  { timestamps: true }
);
