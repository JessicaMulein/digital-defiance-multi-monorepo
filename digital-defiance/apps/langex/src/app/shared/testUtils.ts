import { SettingsManager } from './settingsManager';
import { DefaultWordMasteryColors, ISettings } from './interfaces';
import SpeechSources from './speechSources';
import PreferredVoiceGender from './preferredVoiceGender';
import AudioStorageOption from './audioStorageOption';
import AppSettings from './appSettings';


export function makeExpectedISettings(
    changeKey?: string,
    changeValue?: any
  ): ISettings {
    const settings: ISettings = {
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
    if (changeKey !== undefined && changeValue !== undefined) {
      // ensure settings has the changeKey
      if (!(changeKey in settings)) {
        throw new Error(`Invalid changeKey: ${changeKey}`);
      }
      (settings as any)[changeKey] = changeValue;
    }
    return settings;
  }
  
  export function makeExpectedAppSettings(
    changeKey?: string,
    changeValue?: any
  ): { [key: string]: any } {
    const expectedSettings: ISettings = makeExpectedISettings(changeKey, changeValue);
    const expectedSettingsObject: { [key: string]: any } = {};
    expectedSettingsObject[SettingsManager.settingsKey] = JSON.stringify(
      expectedSettings as AppSettings
    );
    return expectedSettingsObject;
  }