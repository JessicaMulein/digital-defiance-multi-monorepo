// src/background.ts
/// <reference types="chrome"/>

import MessageType from './app/shared/messageType';
import { IChromeMessage} from './app/shared/interfaces';
import { lingvoLookup } from './app/shared/lingvo';
import { SettingsManager } from './app/shared/settingsManager';
import MessageContext from './app/shared/messageContext';
import { receiveMessages } from './app/shared/chromeMessaging';
import { googleTranslateLookup } from './app/shared/googleTranslate';
// TODO: get app settings from messaging with front end
const settingsManager: SettingsManager = new SettingsManager(MessageContext.Background);
console.log('SettingsComponent: settingsManager loaded in background', settingsManager.Settings);

receiveMessages((message: IChromeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  console.log('background.ts: received message', message);
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
    if (message.type === MessageType.GlobalSettingsUpdate) {
      console.log('background.ts: loading updates settings from extension', message.data);
      settingsManager.loadGlobalSettings();
    } else if (message.type === MessageType.LocalSettingsUpdate) {
      console.log('background.ts: loading updates settings from tab', message.data);
      settingsManager.loadLocalSettings();
    }
});

chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    // create new menu
    const topId = chrome.contextMenus.create({
      id: 'langex_context_menu',
      title: 'Language Extension',
      contexts: ['selection','editable'],
    });
    chrome.contextMenus.create({
      id: 'lingvoLookup',
      title: 'Look up word with Lingvo: %s',
      contexts: ['selection'],
      parentId: topId,
      onclick: lingvoLookup,
    });
    chrome.contextMenus.create({
      id: 'googleTranslate',
      title: 'Translate text with Google: %s',
      contexts: ['selection'],
      parentId: topId,
      onclick: googleTranslateLookup,
    });
  }
);

// listen for page load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // process the text of the page
    console.log('tab updated', tabId, changeInfo, tab);
  }
});