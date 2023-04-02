import { Schema } from 'mongoose';

export const ProfileSchema = new Schema(
  {
    /**
     * The id of the user whose profile this is
     */
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      null: false,
      immutable: true,
    },
    userPrincipalName: { type: String, optional: true },
    givenName: { type: String, optional: true },
    surname: { type: String, optional: true },
    bio: { type: String, optional: true },
    location: { type: String, optional: true },
    website: { type: String, optional: true },
    avatar: { type: String, optional: true },
    banner: { type: String, optional: true },
    deletedAt: { type: Date, optional: true },
  },
  { timestamps: true }
);