import { Schema } from 'mongoose';

/**
 * Represents a post being expanded.
 * This is used to track the number of times a post has been expanded.
 */
export const PostExpandSchema = new Schema({
  /**
   * The id of the post being expanded.
   */
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    null: false,
    immutable: true,
  },
  botExclude: { type: Boolean, default: false, required: true, null: false },
  /**
   * The id of the original impression.
   */
  postImpression: {
    type: Schema.Types.ObjectId,
    ref: 'PostImpression',
    required: true,
    null: false,
    immutable: true,
  },
  /**
   * The time the post was expanded.
   */
  createdAt: { type: Date, default: Date.now, required: true, immutable: true },
});
