// src/background.ts
/// <reference types="chrome"/>

import MessageType from './app/shared/messageType';
import { IChromeMessage} from './app/shared/interfaces';
import { searchForWord } from './app/shared/lingvo';
import { SettingsManager } from './app/shared/settingsManager';
import MessageContext from './app/shared/messageContext';
// TODO: get app settings from messaging with front end
const settingsManager: SettingsManager = new SettingsManager(MessageContext.Background);
settingsManager.loadSettings();
console.log('SettingsComponent: settingsManager loaded in background', settingsManager.Settings);

chrome.runtime.onMessage.addListener((request: IChromeMessage, sender, sendResponse) => {
  console.log('background.ts: received message', request);
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
    if (request.type === MessageType.SettingsUpdate) {
      console.log('background.ts: loading updates settings from extension', request.data);
      settingsManager.loadSettings();
    }
});

chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    // create new menu
    chrome.contextMenus.create({
      id: 'searchForWord',
      title: 'Translate: %s',
      contexts: ['selection'],
    });
  }
);

// event handling for menu
chrome.contextMenus.onClicked.addListener(searchForWord);
