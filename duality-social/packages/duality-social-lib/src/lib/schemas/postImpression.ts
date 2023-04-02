import { Schema } from 'mongoose';
import { BaseModelCaches } from '../models/schema';

/**
 * Represents a post being viewed.
 * This is used to track the number of times a post has been viewed.
 */
export const PostImpressionSchema = new Schema({
  /**
   * The id of the post being viewed.
   */
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    null: false,
    immutable: true,
  },
  /**
   * The id of the user viewing the post.
   */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    null: false,
    immutable: true,
  },
  /**
   * The ip address of the user viewing the post.
   */
  ip: { type: String, required: true, null: false, immutable: true },
  botExclude: { type: Boolean, default: false, required: true, null: false },
  createdAt: { type: Date, default: Date.now, required: true, immutable: true },
});
