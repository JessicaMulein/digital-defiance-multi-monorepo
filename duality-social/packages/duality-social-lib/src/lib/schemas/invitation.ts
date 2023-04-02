import { Schema } from 'mongoose';

export const InvitationSchema = new Schema(
  {
    email: { type: String, required: false, optional: true, immutable: true },
    phone: { type: String, required: false, optional: true, immutable: true },
    code: { type: String, required: true, immutable: true },
    maxUses: { type: Number, required: true, immutable: true },
    meta: {
      uses: { type: Number, required: true },
      views: { type: Number, required: true },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Invitation',
      required: true,
      immutable: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);
