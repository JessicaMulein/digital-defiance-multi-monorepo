import { IChromeMessage } from "./interfaces";

  export function sendMessage(message: IChromeMessage): void {
    chrome.runtime.sendMessage(message);
  }

  export function storageSetKey(key: string, value: any): void {
    chrome.storage.sync.set({ [key]: value });
  }

  export function storageGetKey(key: string): any {
    let value: any = null;
    let count = 0;
    chrome.storage.sync.get(key, (items: { [key: string]: any }) => {
      count++;
      if (items[key] !== undefined) {
        value = items[key];
      }
    });
    if (count > 1) {
      throw new Error('SettingsManager: storageGetKey: count > 1');
    }
    return value;
  }