import { TestBed } from '@angular/core/testing';
import { SettingsManager } from './settingsManager';
import * as sinon from 'sinon';
import * as chrome from 'sinon-chrome';

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
    const settingsManager = new SettingsManager();
    expect(settingsManager).toBeTruthy();
    expect(settingsManager.Settings.forvoApiKey).toBe('');
    settingsManager.updateSetting('forvoApiKey', 'test');
    settingsManager.saveSettings();

    sinon.assert.calledOnce(chrome.storage.sync.get);
    sinon.assert.calledOnce(chrome.storage.sync.set);
    sinon.assert.calledWith(chrome.storage.sync.set, {
      __langex_settings:
        '{"lingvoApiKey":"","lingvoApiEnabled":false,"forvoApiKey":"test","forvoApiEnabled":false,"googleApiKey":"","googleApiEnabled":false,"primaryLanguage":"en","primaryLocale":"en-US","preferredVoiceGender":"Either","storeAudio":"None","studiedLanguages":["uk","ru"],"speechSources":["Web speech API"]}',
    });
    // let records = 0;
    // chrome.storage.sync.get([[SettingsManager.settingsKey]], (items: { [key: string]: any }) => {
    //     records++;
    //     expect(items[SettingsManager.settingsKey]).toBeTruthy();
    //     const serializedSettings: Record<string, unknown> = JSON.parse(
    //         items[SettingsManager.settingsKey] as string
    //     );
    //     expect(serializedSettings['forvoApiKey']).toBe('test');
    // });
    // expect(records).toBe(1);
  });
});
