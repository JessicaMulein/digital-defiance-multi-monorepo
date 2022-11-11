// src/background.ts
/// <reference types="chrome"/>

import { SpeechSources } from './interfaces.d';
import { searchForWord } from './lingvo';
import { SettingsManager } from './settingsManager';

const settingsManager: SettingsManager = new SettingsManager([
  'en',
  'uk',
  'ru',
], [
  SpeechSources.WebSpeechAPI,
  SpeechSources.GoogleTTS,
  SpeechSources.ForvoAPI,
  SpeechSources.ForvoScraped,
]);
settingsManager.load();

chrome.runtime.onInstalled.addListener(
  (details: chrome.runtime.InstalledDetails) => {
    console.log(
      'Default background color set to %cgreen',
      `color: ${settingsManager.Settings.color}`
    );
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
