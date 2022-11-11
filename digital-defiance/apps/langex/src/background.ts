// src/background.ts
/// <reference types="chrome"/>

import { ISettings, SupportedLanguage } from './interfaces';
import { searchForWord } from './lingvo';

const settings: ISettings = {
  color: '#3aa757',
  lingvoKey: '',
  languages: [
    SupportedLanguage.Ukrainian,
    SupportedLanguage.English,
    SupportedLanguage.Russian,
  ],
};

chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    chrome.storage.sync.get((items) => {
      const tmp = items as ISettings;
      if (!tmp.lingvoKey || tmp.lingvoKey === '') {
        console.log('need lingvo key');
        chrome.storage.sync.set(settings);
        return;
      }
      settings.color = (items as ISettings).color;
      settings.lingvoKey = (items as ISettings).lingvoKey;
    });
    console.log(
      'Default background color set to %cgreen',
      `color: ${settings.color}`
    );
    // create new menu
    chrome.contextMenus.create({
      id: 'searchForWord',
      title: 'Translate: %s',
      contexts: ['selection'],
    });
  }
);

// function that handles selection search

// event handling for menu
chrome.contextMenus.onClicked.addListener(searchForWord);
