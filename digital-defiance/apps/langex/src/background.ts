// src/background.ts
/// <reference types="chrome"/>

import MessageType from 'libs/langex-core/src/lib/messageType';
import { IChromeMessage} from 'libs/langex-core/src/lib/interfaces';
import { lingvoLookup } from './app/shared/lingvo';
import { SettingsManager } from 'libs/langex-core/src/lib/settingsManager';
import MessageContext from 'libs/langex-core/src/lib/messageContext';
import { receiveMessages } from 'libs/langex-core/src/lib/chromeMessaging';
import { googleTranslateLookup } from './app/shared/googleTranslate';

// TODO: get app settings from messaging with front end
const settingsManager: SettingsManager = new SettingsManager(MessageContext.Background);
console.log('SettingsComponent: settingsManager loaded in background', settingsManager.Settings);

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
    });
    chrome.contextMenus.create({
      id: 'googleTranslate',
      title: 'Translate text with Google: %s',
      contexts: ['selection'],
      parentId: topId,
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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch(info.menuItemId) {
    case 'lingvoLookup':
      lingvoLookup(settingsManager.Settings.primaryLanguage, settingsManager.studiedLanguages, info, tab);
      break;
    case 'googleTranslate':
      googleTranslateLookup(settingsManager.Settings.primaryLanguage, settingsManager.studiedLanguages, info, tab);
      break;
  }
});

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