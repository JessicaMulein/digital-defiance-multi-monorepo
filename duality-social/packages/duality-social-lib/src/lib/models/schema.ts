import { Model, model, Schema } from 'mongoose';
import { IAdminUser } from '../interfaces/adminUser';
import { IInvitation } from '../interfaces/invitation';
import { ILogin } from '../interfaces/login';
import { IPost } from '../interfaces/post';
import { IPostExpand } from '../interfaces/postExpand';
import { IPostImpression } from '../interfaces/postImpression';
import { IPostViewpoint } from '../interfaces/postViewpoint';
import { IProfile } from '../interfaces/profile';
import { IReport } from '../interfaces/report';
import { ISudoLog } from '../interfaces/sudoLog';
import { IUser } from '../interfaces/user';
import { IUserNameChange } from '../interfaces/userNameChange';
import { IViewpointReaction } from '../interfaces/viewpointReaction';
import { AdminUserSchema } from '../schemas/adminUser';
import { InvitationSchema } from '../schemas/invitation';
import { LoginSchema } from '../schemas/login';
import { PostSchema } from '../schemas/post';
import { PostExpandSchema } from '../schemas/postExpand';
import { PostImpressionSchema } from '../schemas/postImpression';
import { PostViewpointSchema } from '../schemas/postViewpoint';
import { ProfileSchema } from '../schemas/profile';
import { ReportSchema } from '../schemas/report';
import { SudoLogSchema } from '../schemas/sudoLog';
import { UserSchema } from '../schemas/user';
import { UserNameChangeSchema } from '../schemas/userNameChange';
import { ViewpointReactionSchema } from '../schemas/viewpointReaction';
import { BaseModelCache } from './baseModelCache';

export const MongooseSchemaNames = [
  'AdminUsers',
  'Invitations',
  'Logins',
  'Posts',
  'PostExpands',
  'PostImpressions',
  'PostViewpoints',
  'Profiles',
  'Reports',
  'SudoLogs',
  'Users',
  'UserNameChanges',
  'ViewpointReactions',
] as const;
export type MongooseSchemaName = typeof MongooseSchemaNames[number];

export const MongooseModelNames = [
  'AdminUser',
  'Invitation',
  'Login',
  'Post',
  'PostExpand',
  'PostImpression',
  'PostViewpoint',
  'Profile',
  'Report',
  'SudoLog',
  'User',
  'UserNameChange',
  'ViewpointReaction',
] as const;
export type MongooseModelName = typeof MongooseModelNames[number];

export const MongooseSchemas: { [key: string] : Schema }  = {
  AdminUsers: AdminUserSchema,
  Invitations: InvitationSchema,
  Logins: LoginSchema,
  Posts: PostSchema,
  PostExpands: PostExpandSchema,
  PostImpressions: PostImpressionSchema,
  PostViewpoints: PostViewpointSchema,
  Profiles: ProfileSchema,
  Reports: ReportSchema,
  SudoLogs: SudoLogSchema,
  Users: UserSchema,
  UserNameChanges: UserNameChangeSchema,
  ViewpointReactions: ViewpointReactionSchema,
};

export const MongooseModelSchemaNames: { [key: string] : string } = {
  AdminUser: 'AdminUser',
  Invitation: 'Invitation',
  Login: 'Login',
  Post: 'Post',
  PostExpand: 'PostExpand',
  PostImpression: 'Impression',
  PostViewpoint: 'PostViewpoint',
  Profile: 'Profile',
  Report: 'Report',
  SudoLog: 'SudoLog',
  User: 'User',
  UserNameChange: 'UserNameChange',
  ViewpointReaction: 'ViewpointReaction',
};

export const MongooseCollectionNames: { [key: string] : string }  = {
  AdminUsers: 'adminUsers',
  Invitations: 'invitations',
  Logins: 'logins',
  Posts: 'posts',
  PostExpands: 'postExpands',
  PostImpressions: 'impressions',
  PostViewpoints: 'postViewpoints',
  Profiles: 'profiles',
  Reports: 'reports',
  SudoLogs: 'sudoLogs',
  Users: 'users',
  UserNameChanges: 'userNameChanges',
  ViewpointReactions: 'viewpointReactions',
};

export const MongooseCollectionPaths: { [key: string] : string } = {
  AdminUsers: `/${MongooseCollectionNames['AdminUsers']}`,
  Invitations: `/${MongooseCollectionNames['Invitations']}`,
  Logins: `/${MongooseCollectionNames['Logins']}`,
  Posts: `/${MongooseCollectionNames['Posts']}`,
  PostExpands: `/${MongooseCollectionNames['PostExpands']}`,
  PostImpressions: `/${MongooseCollectionNames['PostImpressions']}`,
  PostViewpoints: `/${MongooseCollectionNames['PostViewpoints']}`,
  Profiles: `/${MongooseCollectionNames['Profiles']}`,
  Reports: `/${MongooseCollectionNames['Reports']}`,
  SudoLogs: `/${MongooseCollectionNames['SudoLogs']}`,
  Users: `/${MongooseCollectionNames['Users']}`,
  UserNameChanges: `/${MongooseCollectionNames['UserNameChanges']}`,
  ViewpointReactions: `/${MongooseCollectionNames['ViewpointReactions']}`,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MongooseModels: { [key: string] : Model<any> }  = {
  AdminUser: model<IAdminUser>(
    MongooseModelSchemaNames['AdminUser'],
    MongooseSchemas['AdminUsers'],
    MongooseCollectionNames['AdminUsers']
  ),
  Invitation: model<IInvitation>(
    MongooseModelSchemaNames['Invitation'],
    MongooseSchemas['Invitations'],
    MongooseCollectionNames['Invitations']
  ),
  Login: model<ILogin>(
    MongooseModelSchemaNames['Login'],
    MongooseSchemas['Logins'],
    MongooseCollectionNames['Logins']
  ),
  Post: model<IPost>(
    MongooseModelSchemaNames['Post'],
    MongooseSchemas['Posts'],
    MongooseCollectionNames['Posts']
  ),
  PostExpand: model<IPostExpand>(
    MongooseModelSchemaNames['PostExpand'],
    MongooseSchemas['PostExpands'],
    MongooseCollectionNames['PostExpands']
  ),
  PostImpression: model<IPostImpression>(
    MongooseModelSchemaNames['PostImpression'],
    MongooseSchemas['PostImpressions'],
    MongooseCollectionNames['PostImpressions']
  ),
  PostViewpoint: model<IPostViewpoint>(
    MongooseModelSchemaNames['PostViewpoint'],
    MongooseSchemas['PostViewpoints'],
    MongooseCollectionNames['PostViewpoints']
  ),
  Profile: model<IProfile>(
    MongooseModelSchemaNames['Profile'],
    MongooseSchemas['Profiles'],
    MongooseCollectionNames['Profiles']
  ),
  Report: model<IReport>(
    MongooseModelSchemaNames['Report'],
    MongooseSchemas['Reports'],
    MongooseCollectionNames['Reports']
  ),
  SudoLog: model<ISudoLog>(
    MongooseModelSchemaNames['SudoLog'],
    MongooseSchemas['SudoLogs'],
    MongooseCollectionNames['SudoLogs']
  ),
  User: model<IUser>(
    MongooseModelSchemaNames['User'],
    MongooseSchemas['Users'],
    MongooseCollectionNames['Users']
  ),
  UserNameChange: model<IUserNameChange>(
    MongooseModelSchemaNames['UserNameChange'],
    MongooseSchemas['UserNameChanges'],
    MongooseCollectionNames['UserNameChanges']
  ),
  ViewpointReaction: model<IViewpointReaction>(
    MongooseModelSchemaNames['ViewpointReaction'],
    MongooseSchemas['ViewpointReactions'],
    MongooseCollectionNames['ViewpointReactions']
  ),
};

export const BaseModelCaches = {
  AdminUsers: new BaseModelCache<IAdminUser>(
    MongooseModelSchemaNames['AdminUser'],
    MongooseCollectionPaths['AdminUsers'],
    MongooseSchemas['AdminUsers'],
    MongooseModels['AdminUser'],
    MongooseCollectionNames['AdminUsers']
  ),
  Invitations: new BaseModelCache<IInvitation>(
    MongooseModelSchemaNames['Invitation'],
    MongooseCollectionPaths['Invitations'],
    MongooseSchemas['Invitations'],
    MongooseModels['Invitation'],
    MongooseCollectionNames['Invitations']
  ),
  Logins: new BaseModelCache<ILogin>(
    MongooseModelSchemaNames['Login'],
    MongooseCollectionPaths['Logins'],
    MongooseSchemas['Logins'],
    MongooseModels['Login'],
    MongooseCollectionNames['Logins']
  ),
  Posts: new BaseModelCache<IPost>(
    MongooseModelSchemaNames['Post'],
    MongooseCollectionPaths['Posts'],
    MongooseSchemas['Posts'],
    MongooseModels['Post'],
    MongooseCollectionNames['Posts']
  ),
  PostExpands: new BaseModelCache<IPostExpand>(
    MongooseModelSchemaNames['PostExpand'],
    MongooseCollectionPaths['PostExpands'],
    MongooseSchemas['PostExpands'],
    MongooseModels['PostExpand'],
    MongooseCollectionNames['PostExpands']
  ),
  PostImpressions: new BaseModelCache<IPostImpression>(
    MongooseModelSchemaNames['PostImpression'],
    MongooseCollectionPaths['PostImpressions'],
    MongooseSchemas['PostImpressions'],
    MongooseModels['PostImpression'],
    MongooseCollectionNames['PostImpressions']
  ),
  PostViewpoints: new BaseModelCache<IPostViewpoint>(
    MongooseModelSchemaNames['PostViewpoint'],
    MongooseCollectionPaths['PostViewpoints'],
    MongooseSchemas['PostViewpoints'],
    MongooseModels['PostViewpoint'],
    MongooseCollectionNames['PostViewpoints']
  ),
  Profiles: new BaseModelCache<IProfile>(
    MongooseModelSchemaNames['Profile'],
    MongooseCollectionPaths['Profiles'],
    MongooseSchemas['Profiles'],
    MongooseModels['Profile'],
    MongooseCollectionNames['Profiles']
  ),
  Reports: new BaseModelCache<IReport>(
    MongooseModelSchemaNames['Report'],
    MongooseCollectionPaths['Reports'],
    MongooseSchemas['Reports'],
    MongooseModels['Report'],
    MongooseCollectionNames['Reports']
  ),
  SudoLogs: new BaseModelCache<ISudoLog>(
    MongooseModelSchemaNames['SudoLog'],
    MongooseCollectionPaths['SudoLogs'],
    MongooseSchemas['SudoLogs'],
    MongooseModels['SudoLog'],
    MongooseCollectionNames['SudoLogs']
  ),
  Users: new BaseModelCache<IUser>(
    MongooseModelSchemaNames['User'],
    MongooseCollectionPaths['Users'],
    MongooseSchemas['Users'],
    MongooseModels['User'],
    MongooseCollectionNames['Users']
  ),
  UserNameChanges: new BaseModelCache<IUserNameChange>(
    MongooseModelSchemaNames['UserNameChange'],
    MongooseCollectionPaths['UserNameChanges'],
    MongooseSchemas['UserNameChanges'],
    MongooseModels['UserNameChange'],
    MongooseCollectionNames['UserNameChanges']
  ),
  ViewpointReactions: new BaseModelCache<IViewpointReaction>(
    MongooseModelSchemaNames['ViewpointReaction'],
    MongooseCollectionPaths['ViewpointReactions'],
    MongooseSchemas['ViewpointReactions'],
    MongooseModels['ViewpointReaction'],
    MongooseCollectionNames['ViewpointReactions']
  ),
};
