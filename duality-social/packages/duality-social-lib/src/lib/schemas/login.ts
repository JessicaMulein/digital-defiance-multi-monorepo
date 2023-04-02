import { Schema } from 'mongoose';

/**
 * Represents a user logging in.
 */
export const LoginSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    null: false,
    immutable: true,
  },
  ip: { type: String, required: true, null: false, immutable: true },
  userAgent: { type: String, required: true, null: false, immutable: true },
  createdAt: { type: Date, default: Date.now, required: true, immutable: true },
});
