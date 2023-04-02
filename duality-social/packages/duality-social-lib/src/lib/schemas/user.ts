import { Schema } from 'mongoose';
import { AccountStatusTypeEnum } from '../enumerations/accountStatusType';
import { AccountLoginTypeEnum } from '../enumerations/accountLoginType';
import { AdminLevelEnum } from '../enumerations/adminLevel';
import { LockTypeEnum } from '../enumerations/lockType';
import { BaseModelCaches } from '../models/schema';

/**
 * A user in the system.
 */
export const UserSchema = new Schema(
  {
    /**
     * Whether the login is via email/password or via external authentication.
     */
    accountType: {
      type: String,
      enum: AccountLoginTypeEnum,
      default: AccountLoginTypeEnum.Microsoft,
      required: true,
    },
    accountStatusType: {
      type: String,
      enum: AccountStatusTypeEnum,
      default: AccountStatusTypeEnum.Active,
      required: true,
      null: false,
    },
    /**
     * The user's email address, used for login if accountType is email/password.
     * Used for sending notifications, regardless.
     */
    accountEmail: { type: String, unique: true, index: true, optional: true },
    /**
     * Whether the user has verified their email address.
     * See also a record in the email verification collection.
     */
    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
      null: false,
    },
    /**
     * The user's password hash, used for login if accountType is email/password.
     */
    accountPasswordHash: { type: String, optional: true },
    accoungPasswordSalt: { type: String, optional: true },
    /**
     * The unique @username of the user.
     */
    userName: {
      type: String,
      unique: true,
      required: true,
      index: true,
      null: false,
    },
    /**
     * Quick reference field for whether the user is an administrator.
     * Backed up by a record in the adminUsers collection with their
     * sudo password hash and other admin metadata.
     */
    adminLevel: {
      type: String,
      enum: AdminLevelEnum,
      default: AdminLevelEnum.User,
    },
    /**
     * Posts from this account are not included in the main feed.
     * The user sees their own posts.
     */
    shadowBan: { type: Boolean, default: false, required: true, null: false },
    /**
     * The user's profile is not visible to other users (appears deleted).
     */
    userHidden: { type: Boolean, default: false, required: true, null: false },
    /**
     * User's last login date/time.
     * See also logins collection.
     */
    lastLogin: { type: Date, optional: true },
    /**
     * The user who last updated the user.
     */
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      optional: true,
    },
    /**
     * The date/time the user was deleted.
     */
    deletedAt: { type: Date, optional: true },
    /**
     * The user who deleted the user.
     */
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      optional: true,
    },
    /**
     * Whether the account is under any kind of lock.
     */
    adminFreezeType: {
      type: String,
      enum: LockTypeEnum,
      default: LockTypeEnum.PendingEmailVerification,
    },
    meta: {
      /**
       * How many posts the user has made.
       */
      totalPosts: { type: Number, default: 0 },
      /**
       * How many replies the user has made.
       */
      totalReplies: { type: Number, default: 0 },
      /**
       * The total number of reactions the user has made on other posts.
       */
      totalReactions: { type: Number, default: 0 },
      /**
       * The total number of reactions the user has received on their posts.
       */
      totalReactionsReceived: { type: Number, default: 0 },
      /**
       * The total number of votes the user has made on other posts.
       */
      totalVotes: { type: Number, default: 0 },
      /**
       * The total number of votes the user has received on their posts.
       */
      totalVotesReceived: { type: Number, default: 0 },
      /**
       * The total number of impressions the user has received on their profile.
       */
      totalProfileViewsReceived: { type: Number, default: 0 },
      /**
       * The total number of impressions the user has received on their posts.
       */
      totalPostViewsReceived: { type: Number, default: 0 },
      /**
       * The total number of impressions the user has received on their replies.
       */
      totalReplyViewsReceived: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);
