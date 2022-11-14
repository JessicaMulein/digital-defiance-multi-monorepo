import { SettingsManager } from './settingsManager';
import * as sinon from 'sinon';
import * as chrome from 'sinon-chrome';
import MessageContext from './messageContext';
import { makeExpectedAppSettings, makeExpectedISettings } from './testUtils'
import AppSettings from './appSettings';

describe('AppComponent', () => {
  beforeEach(async () => {
    chrome.reset();
  });
  it('should create the manager', () => {
    const settingsManager = new SettingsManager(MessageContext.Extension);
    expect(settingsManager).toBeInstanceOf(SettingsManager);
    expect(settingsManager.Settings).toEqual(makeExpectedISettings() as AppSettings);
    // creating a new instance loads the settings
    sinon.assert.calledOnce(chrome.storage.sync.get);
  });
  it('should load the correct settings from the storage', () => {
    // force chrome.storage.sync.get to return the correct value
    // arrange
    const updatedForvoApiKey = 'forvoApiKeyTest';
    const expectedSettings = makeExpectedAppSettings(
      'forvoApiKey',
      updatedForvoApiKey
    );
    chrome.storage.sync.get.yields(expectedSettings);
    /// act
    const settingsManager = new SettingsManager(MessageContext.Extension);
    // assert
    expect(settingsManager).toBeInstanceOf(SettingsManager);
    expect(settingsManager.Settings).toEqual(makeExpectedISettings(
      'forvoApiKey',
      updatedForvoApiKey
    ));
  });
  it('should be able to save the settings', () => {
    // arrange
    const updatedForvoApiKey = 'forvoApiKeyTest';
    const expectedSettings = makeExpectedAppSettings(
      'forvoApiKey',
      updatedForvoApiKey
    );
    // act
    const settingsManager = new SettingsManager(MessageContext.Extension);
    // assert
    expect(settingsManager).toBeInstanceOf(SettingsManager);
    expect(settingsManager.Settings).toEqual(makeExpectedISettings());

    // arrange - update the settings
    settingsManager.updateSetting('forvoApiKey', updatedForvoApiKey);
    // act - save the settings
    settingsManager.saveSettings();
    // assert
    sinon.assert.calledOnce(chrome.storage.sync.get);
    sinon.assert.calledOnce(chrome.storage.sync.set);
    sinon.assert.calledWith(chrome.storage.sync.set, expectedSettings);
  });
});
