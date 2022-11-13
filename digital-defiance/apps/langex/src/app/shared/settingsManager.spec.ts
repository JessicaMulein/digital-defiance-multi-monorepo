import { TestBed } from '@angular/core/testing';
import { SettingsManager } from './settingsManager';
import * as sinon from 'sinon';
import * as chrome from 'sinon-chrome';
import { DefaultWordMasteryColors, ISettings } from './interfaces';
import SpeechSources from './speechSources';
import PreferredVoiceGender from './preferredVoiceGender';
import AudioStorageOption from './audioStorageOption';
import AppSettings from './appSettings';

function makeExpectedSettings(
  changeKey: string,
  changeValue: any
): { [key: string]: any } {
  const expectedSettings: ISettings = {
    lingvoApiKey: '',
    lingvoApiEnabled: false,
    forvoApiKey: '',
    forvoApiEnabled: false,
    googleApiKey: '',
    googleApiEnabled: false,
    preferredVoiceGender: PreferredVoiceGender.Either,
    primaryLanguage: 'en',
    primaryLocale: 'en-US',
    storeAudio: AudioStorageOption.None,
    studiedLanguages: ['uk', 'ru'],
    speechSources: [SpeechSources.WebSpeechAPI],
    wordMasteryColors: DefaultWordMasteryColors,
  };
  // ensure settings has the changeKey
  if (!(changeKey in expectedSettings)) {
    throw new Error(`Invalid changeKey: ${changeKey}`);
  }
  (expectedSettings as any)[changeKey] = changeValue;
  const expectedSettingsObject: { [key: string]: any } = {};
  expectedSettingsObject[SettingsManager.settingsKey] = JSON.stringify(
    expectedSettings as AppSettings
  );
  return expectedSettingsObject;
}

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
  it('should load the correct settings from the storage', () => {
    // force chrome.storage.sync.get to return the correct value
    const updatedForvoApiKey = 'forvoApiKeyTest';
    const expectedSettings = makeExpectedSettings(
      'forvoApiKey',
      updatedForvoApiKey
    );
    chrome.storage.sync.get.yields(expectedSettings);

    const settingsManager = new SettingsManager();
    expect(settingsManager).toBeTruthy();
    expect(settingsManager.Settings.forvoApiKey).toBe(updatedForvoApiKey);
  });
  it('should be able to save the settings', () => {
    const updatedForvoApiKey = 'forvoApiKeyTest';
    const expectedSettings = makeExpectedSettings(
      'forvoApiKey',
      updatedForvoApiKey
    );

    const settingsManager = new SettingsManager();
    expect(settingsManager).toBeTruthy();
    expect(settingsManager.Settings.forvoApiKey).toBe('');
    settingsManager.updateSetting('forvoApiKey', updatedForvoApiKey);
    settingsManager.saveSettings();

    sinon.assert.calledOnce(chrome.storage.sync.get);
    sinon.assert.calledOnce(chrome.storage.sync.set);

    sinon.assert.calledWith(chrome.storage.sync.set, expectedSettings);
  });
});
