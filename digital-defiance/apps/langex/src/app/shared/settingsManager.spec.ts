import { TestBed } from '@angular/core/testing';
import { SettingsManager } from './settingsManager';
import * as sinon from 'sinon';
import * as chrome from 'sinon-chrome';
import { DefaultWordMasteryColors, ISettings } from './interfaces';
import SpeechSources from './speechSources';
import PreferredVoiceGender from './preferredVoiceGender';
import AudioStorageOption from './audioStorageOption';
import AppSettings from './appSettings';

describe('AppComponent', () => {
  beforeEach(async () => {
    chrome.reset();
  });
  it('should create the manager', () => {
    const settingsManager = new SettingsManager();
    expect(settingsManager).toBeTruthy();
    // creating a new instance loads the settings
    sinon.assert.calledOnce(chrome.storage.sync.get);
  });
  it('should be able to save the settings', () => {
    const updatedForvoApiKey = 'updatedForvoApiKey';
    const settingsManager = new SettingsManager();
    expect(settingsManager).toBeTruthy();
    expect(settingsManager.Settings.forvoApiKey).toBe('');
    settingsManager.updateSetting('forvoApiKey', updatedForvoApiKey);
    settingsManager.saveSettings();

    sinon.assert.calledOnce(chrome.storage.sync.get);
    sinon.assert.calledOnce(chrome.storage.sync.set);

    const expectedSettings: ISettings = {
      lingvoApiKey: '',
      lingvoApiEnabled: false,
      forvoApiKey: updatedForvoApiKey,
      forvoApiEnabled: false,
      googleApiKey: '',
      googleApiEnabled: false,
      preferredVoiceGender: PreferredVoiceGender.Either,
      primaryLanguage: 'en',
      primaryLocale: 'en-US',
      storeAudio: AudioStorageOption.None,
      studiedLanguages: ['uk', 'ru'],
      speechSources: [SpeechSources.WebSpeechAPI],
      wordMasteryColors: DefaultWordMasteryColors
    };
    const expectedSettingsObject: { [key: string]: any }= {};
    expectedSettingsObject[SettingsManager.settingsKey] = JSON.stringify(expectedSettings as AppSettings);
    sinon.assert.calledWith(chrome.storage.sync.set, expectedSettingsObject);
  });
  it("should load the correct settings from the storage", () => {
    // force chrome.storage.sync.get to return the correct value
    const updatedForvoApiKey = 'updatedForvoApiKey';
    const expectedSettings: ISettings = {
      lingvoApiKey: '',
      lingvoApiEnabled: false,
      forvoApiKey: updatedForvoApiKey,
      forvoApiEnabled: false,
      googleApiKey: '',
      googleApiEnabled: false,
      preferredVoiceGender: PreferredVoiceGender.Either,
      primaryLanguage: 'en',
      primaryLocale: 'en-US',
      storeAudio: AudioStorageOption.None,
      studiedLanguages: ['uk', 'ru'],
      speechSources: [SpeechSources.WebSpeechAPI],
      wordMasteryColors: DefaultWordMasteryColors
    };
    const expectedSettingsObject: { [key: string]: any }= {};
    expectedSettingsObject[SettingsManager.settingsKey] = JSON.stringify(expectedSettings as AppSettings);
    chrome.storage.sync.get.yields(expectedSettingsObject);

    const settingsManager = new SettingsManager();
    expect(settingsManager).toBeTruthy();
    expect(settingsManager.Settings.forvoApiKey).toBe(updatedForvoApiKey);
  });
});
