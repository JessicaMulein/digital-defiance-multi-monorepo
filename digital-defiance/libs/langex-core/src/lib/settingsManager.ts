import AppSettings from './appSettings';
import { storageGetKey, storageSetKey } from './chromeStorage';
import { sendMessageFromBackground } from './chromeMessaging';
import MessageContext from './messageContext';
import MessageType from './messageType';
import SpeechSources from './speechSources';
import WordMastery from './wordMastery';
import { WordMasteryStatus } from './interfaces';
import { LocalSettings } from './localSettings';
import StorageOption from './storageOption';

/**
 * Use browser/chrome storage to store settings
 */
export class SettingsManager {
  public static readonly settingsKey = 'settings';
  public static readonly learnedWordKey = 'learnedWords';
  public static readonly studiedLanguagesKey = 'studiedLanguages';
  public readonly context: MessageContext;
  private readonly _globalSettings: AppSettings;
  private readonly _localSettings: LocalSettings;
  private readonly _uiLanguage: string;

  constructor(
    context: MessageContext,
    primaryLanguage = 'en',
    primaryLocale = 'en-US',
    defaultStudiedLanguages: string[] = ['uk', 'ru'],
    defaultSpeechSources: SpeechSources[] = [SpeechSources.WebSpeechAPI]
  ) {
    this._uiLanguage = chrome.i18n.getUILanguage();
    //this.browserAcceptLanguages = chrome.i18n.getAcceptLanguages();
    this.context = context;
    this._globalSettings = new AppSettings(
      primaryLanguage,
      primaryLocale,
      defaultStudiedLanguages,
      defaultSpeechSources
    );
    this._localSettings = new LocalSettings(
      [],
      [],
      true,
      true,
    );

    this.loadGlobalSettings();
    this.loadLocalSettings();
  }

  public static getKeyIdentifier(key: string, ...args: string[]): string {
    // if no additional arguments, no trailing _ will be added
    const trailing = args.length > 0 ? `_${args.join('_')}` : '';
    return `${key}${trailing}`;
  }

  public verifyHexColor(color: string): boolean {
    const colorRegex = /^#[0-9A-F]{6}$/i;
    return colorRegex.test(color);
  }

  public verifyColorName(color: string): boolean {
      const s = new Option().style;
      s.color = color;
      return s.color !== '';
  }

  /**
   * Saves only the settings object to chrome storage
   */
  public saveGlobalSettings(): void {
    storageSetKey(SettingsManager.settingsKey, JSON.stringify(this._globalSettings), StorageOption.SyncedStorage);
    sendMessageFromBackground({
      type: MessageType.GlobalSettingsUpdate,
      context: this.context,
      data: this._globalSettings,
    });
  }

  public updateGlobalSetting(key: string, value: any, save = false): void {
    if (!Object.prototype.hasOwnProperty.call(this._globalSettings, key)) {
      throw new Error(`SettingsManager: updateSetting: key ${key} not found`);
    }
    (this._globalSettings as any)[key] = value;
    if (save) {
      this.saveGlobalSettings();
    }
  }

  /**
   * Loads the settings object from chrome storage
   */
  public loadGlobalSettings(failIfNotFound = false): void {
    const settings = storageGetKey(SettingsManager.settingsKey, StorageOption.SyncedStorage);
    if (failIfNotFound && typeof settings !== 'string') {
      throw new Error('SettingsManager: loadSettings: settings not found');
    }
    if (settings !== null) {
      const serializedSettings: AppSettings = JSON.parse(settings as string);
      if (serializedSettings !== null) {
        this.setGlobalSettingsFromOther(serializedSettings as AppSettings);
      }
    }
  }

  /**
   * 
   */
  public loadLocalSettings(): void {
    //throw new Error('Method not implemented.');
    // const storedSettings = localStorage.getItem(SettingsManager.settingsKey);
    // if (storedSettings !== null) {
    // }
  }

  public saveLocalSettings(): void {
    throw new Error('Method not implemented.');
    // localStorage.setItem(SettingsManager.settingsKey, JSON.stringify(this.localSettings));
  }

  /**
   * @param key
   * @param value
   */
  public saveExtraData<T>(
    key: string,
    value: T,
    ...extraKeyArgs: string[]
  ): void {
    const keyIdentifier = SettingsManager.getKeyIdentifier(
      key,
      ...extraKeyArgs
    );
    chrome.storage.sync.set({ [keyIdentifier]: JSON.stringify(value) });
  }

  public loadExtraData<T>(key: string, ...extraKeyArgs: string[]): T | null {
    const keyIdentifier = SettingsManager.getKeyIdentifier(
      key,
      ...extraKeyArgs
    );
    let value: T | null = null;
    chrome.storage.sync.get(keyIdentifier, (items: { [key: string]: any }) => {
      if (items[keyIdentifier]) {
        value = JSON.parse(items[keyIdentifier] as string);
      }
    });
    return value;
  }

  public removeExtraData(key: string, ...extraKeyArgs: string[]): void {
    const keyIdentifier = SettingsManager.getKeyIdentifier(
      key,
      ...extraKeyArgs
    );
    chrome.storage.sync.remove(keyIdentifier);
  }

  private setGlobalSettingsFromOther(value: AppSettings): void {
    this._globalSettings.forvoApiKey = value.forvoApiKey;
    this._globalSettings.forvoApiEnabled = value.forvoApiEnabled;
    this._globalSettings.googleApiKey = value.googleApiKey;
    this._globalSettings.googleApiEnabled = value.googleApiEnabled;
    this._globalSettings.lingvoApiKey = value.lingvoApiKey;
    this._globalSettings.lingvoApiEnabled = value.lingvoApiEnabled;
    this._globalSettings.preferredVoiceGender = value.preferredVoiceGender;
    this._globalSettings.primaryLanguage = value.primaryLanguage;
    this._globalSettings.primaryLocale = value.primaryLocale;
    this._globalSettings.studiedLanguages = value.studiedLanguages;
    this._globalSettings.speechSources = value.speechSources;
    this._globalSettings.storeAudio = value.storeAudio;
    this._globalSettings.wordMasteryColors = value.wordMasteryColors;
  }

  public get Settings(): AppSettings {
    return this._globalSettings;
  }

  public set Settings(value: AppSettings) {
    this.setGlobalSettingsFromOther(value);
    this.saveGlobalSettings();
  }

  public get uiLanguage(): string {
    return this._uiLanguage;
  }

  public get studiedLanguages(): string[] {
    const languages: string[] = [];
    const extraData: string[] | null = this.loadExtraData<string[]>(
      SettingsManager.studiedLanguagesKey
    );
    if (extraData) {
      extraData.forEach((language) => {
        languages.push(language);
      });
    }
    return languages;
  }

  public studyLanguage(language: string): void {
    const studiedLanguages = this.studiedLanguages;
    if (!studiedLanguages.includes(language)) {
      studiedLanguages.push(language);
      this.saveExtraData(SettingsManager.studiedLanguagesKey, studiedLanguages);
    }
  }

  public studyingLanguage(language: string): boolean {
    return this.studiedLanguages.includes(language);
  }

  public updateWord(language: string, word: string, status: WordMastery): void {
    if (status === WordMastery.Unrecognized) {
      this.removeExtraData(SettingsManager.learnedWordKey, language, word);
      return;
    }
    this.saveExtraData(SettingsManager.learnedWordKey, status, language, word);
  }

  public lookupWordMastery(language: string, word: string): WordMastery {
    const learnedWord = this.loadExtraData<WordMastery>(
      SettingsManager.learnedWordKey,
      language,
      word
    );
    if (learnedWord !== null) {
      return learnedWord;
    }
    return WordMastery.Unrecognized;
  }

  public lookupWordMasteryForWords(language: string, words: string[]): WordMastery[] {
    const masteredWords: WordMastery[] = [];
    words.forEach((word) => {
      masteredWords.push(this.lookupWordMastery(language, word));
    });
    return masteredWords;
  }

  public makeWordMasteryStatusMap(language: string, words: string[]): Map<string, WordMasteryStatus> {
    // ensure word list is unique
    const uniqueWords = [...new Set(words)];
    const masteredWordMap = new Map<string, WordMasteryStatus>();
    uniqueWords.forEach((word, index) => {
      const mastery = this.lookupWordMastery(language, word);
      masteredWordMap.set(word, {
        word: word,
        language: language,
        status: mastery,
        color: this._globalSettings.wordMasteryColors[mastery],
      });
    });
    return masteredWordMap;
  }

  // async analyzePage(title: string, text: string): Promise<Record<string, WordLanguageAndStatus>> {
  //   const words = text.split(' ');
  //   const detections = await detectLanguage(words);
  //     const wordLanguageAndStatuses: Record<string, WordLanguageAndStatus> = {};
  //     words.forEach((word) => {
  //       wordLanguageAndStatuses[word] = {
  //         language: detections[word],
  //         status:
  //       };
  //     });
  //     return wordLanguageAndStatuses;
  //   }

  // public filterPageWordsByStudiedLanguages(pageWords: string[])
  // {
  //   const studiedLanguages = this.studiedLanguages;
  //   detectLanguage(pageWords).then((language: DetectionResult) => {
  //     if (language && studiedLanguages.includes(language)) {

  //   return pageWords.filter((word) => {
  //     return studiedLanguages.includes());
  //   });
  // }
}
