export enum MessageType {
  GlobalSettingsUpdate = 'globalSettingsUpdate',
  LocalSettingsUpdate = 'localSettingsUpdate',
  Extend = 'extend',
  Enable = 'enable',
  Disable = 'disable',
  Reset = 'reset',
  Refresh = 'refresh',
  AddMask = 'addMask',
  AddRuler = 'addRuler',
  UpdateMask = 'updateMask',
  UpdateRuler = 'updateRuler',
}

export default MessageType;
