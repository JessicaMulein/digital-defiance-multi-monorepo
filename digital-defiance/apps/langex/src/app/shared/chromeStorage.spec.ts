import { storageGetKey, storageSetKey } from './chromeStorage';
import { SettingsManager } from './settingsManager';
import * as chrome from 'sinon-chrome';
import * as sinon from 'sinon';

describe('chromeStorage', () => {
  beforeEach(() => {
    chrome.reset();
  });
  it('should be able to get from storage using the helper', () => {
    // arrange
    const expectedValue = 'test';
    const value: { [key: string]: any } = {};
    value[SettingsManager.settingsKey] = expectedValue;
    chrome.storage.sync.get.yields(value);
    // act
    const result = storageGetKey(SettingsManager.settingsKey);
    // assert
    expect(result).toBe(expectedValue);
  });
  it('should be able to set to storage using the helper', () => {
    // arrange
    const testKey = 'testKey';
    const testValue = 'testValue';
    const expectedValue: { [key: string]: any } = {};
    expectedValue[testKey] = testValue;
    // act
    storageSetKey(testKey, testValue);
    // assert
    sinon.assert.calledOnce(chrome.storage.sync.set);
    sinon.assert.calledWith(chrome.storage.sync.set, expectedValue);
  });
});

