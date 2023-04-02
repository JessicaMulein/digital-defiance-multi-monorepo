import { Schema } from 'mongoose';

export const SudoLogSchema = new Schema({
  /**
   * The id of the user attempting sudo.
   */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  },
  /**
   * The id of the admin user if the sudo attempt was successful.
   */
  adminUser: { type: Schema.Types.ObjectId, optional: true, immutable: true },
  /**
   * Whether the sudo attempt was successful.
   */
  success: { type: Boolean, required: true, immutable: true, null: false },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    immutable: true,
  },
});
