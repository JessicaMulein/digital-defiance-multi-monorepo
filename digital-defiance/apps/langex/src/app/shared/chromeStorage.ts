export function storageSetKey(key: string, value: any): void {
  chrome.storage.sync.set({ [key]: value });
}

export function storageGetKey(key: string): any {
  let value: any = null;
  chrome.storage.sync.get(key, (items: { [key: string]: any }) => {
    if (items[key] !== undefined) {
      value = items[key];
    }
  });
  return value;
}
