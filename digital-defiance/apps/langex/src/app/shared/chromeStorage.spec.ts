import { storageGetKey, storageSetKey } from './chromeStorage';
import { SettingsManager } from './settingsManager';
import * as chrome from 'sinon-chrome';
import * as sinon from 'sinon';
import StorageOption from './storageOption';

describe('chromeStorage', () => {
  beforeEach(() => {
    chrome.reset();
  });
  it('should be able to get from synced storage using the helper', () => {
    // arrange
    const expectedValue = 'test';
    const value: { [key: string]: any } = {};
    value[SettingsManager.settingsKey] = expectedValue;
    chrome.storage.sync.get.yields(value);
    // act
    const result = storageGetKey(SettingsManager.settingsKey, StorageOption.SyncedStorage);
    // assert
    expect(result).toBe(expectedValue);
  });
  it('should be able to set to synced storage using the helper', () => {
    // arrange
    const testKey = 'testKey';
    const testValue = 'testValue';
    const expectedValue: { [key: string]: any } = {};
    expectedValue[testKey] = testValue;
    // act
    storageSetKey(testKey, testValue, StorageOption.SyncedStorage);
    // assert
    sinon.assert.calledOnce(chrome.storage.sync.set);
    sinon.assert.calledWith(chrome.storage.sync.set, expectedValue);
  });
  it('should be able to get from local storage using the helper', () => {
    // arrange
    const expectedValue = 'test';
    const value: { [key: string]: any } = {};
    value[SettingsManager.settingsKey] = expectedValue;
    chrome.storage.local.get.yields(value);
    // act
    const result = storageGetKey(SettingsManager.settingsKey, StorageOption.LocalStorage);
    // assert
    expect(result).toBe(expectedValue);
  });
  it('should be able to set to local storage using the helper', () => {
    // arrange
    const testKey = 'testKey';
    const testValue = 'testValue';
    const expectedValue: { [key: string]: any } = {};
    expectedValue[testKey] = testValue;
    // act
    storageSetKey(testKey, testValue, StorageOption.LocalStorage);
    // assert
    sinon.assert.calledOnce(chrome.storage.local.set);
    sinon.assert.calledWith(chrome.storage.local.set, expectedValue);
  });
});

