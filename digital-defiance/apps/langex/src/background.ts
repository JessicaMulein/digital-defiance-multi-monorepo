// src/background.ts
/// <reference types="chrome"/>

import MessageType from './app/shared/messageType';
import { IChromeMessage} from './app/shared/interfaces';
import { searchForWord } from './app/shared/lingvo';
import { SettingsManager } from './app/shared/settingsManager';
import MessageContext from './app/shared/messageContext';
import { receiveMessages } from './app/shared/chromeMessaging';
// TODO: get app settings from messaging with front end
const settingsManager: SettingsManager = new SettingsManager(MessageContext.Background);
settingsManager.loadSettings();
console.log('SettingsComponent: settingsManager loaded in background', settingsManager.Settings);

receiveMessages((message: IChromeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  console.log('background.ts: received message', message);
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
    if (message.type === MessageType.SettingsUpdate) {
      console.log('background.ts: loading updates settings from extension', message.data);
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
