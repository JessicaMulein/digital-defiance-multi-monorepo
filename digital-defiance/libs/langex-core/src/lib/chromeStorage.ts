import StorageOption from './storageOption';

export function storageSetKey(
  key: string,
  value: any,
  storageType: StorageOption
): void {
  if (storageType === StorageOption.LocalStorage) {
    chrome.storage.local.set({ [key]: value });
  } else if (storageType === StorageOption.SyncedStorage) {
    chrome.storage.sync.set({ [key]: value });
  } else {
    throw new Error('Invalid storage type');
  }
}

export function storageGetKey(key: string, storageType: StorageOption): any {
  let value: any = null;
  const cb = (items: { [key: string]: any }) => {
    if (items[key] !== undefined) {
      value = items[key];
    }
  };
  if (storageType === StorageOption.LocalStorage) {
    chrome.storage.local.get(key, cb);
  } else if (storageType === StorageOption.SyncedStorage) {
    chrome.storage.sync.get(key, cb);
  } else {
    throw new Error('Invalid storage type');
  }
  return value;
}
