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
    // I guess we can either only check that the call was made or emulate the storage so that the calls work

    sinon.assert.calledOnce(chrome.storage.sync.get);
    sinon.assert.calledOnce(chrome.storage.sync.set);
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
