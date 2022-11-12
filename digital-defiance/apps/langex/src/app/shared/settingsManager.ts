import AppSettings from './appSettings';
import SpeechSources from './speechSources';
import WordMastery from './wordMastery';

/**
 * Use browser/chrome storage to store settings
 */
export class SettingsManager {
  public static readonly settingsKey = '__langex_settings';
  public static readonly keyIdentifier = '__langex';
  public static readonly learnedWordKey = 'learnedWords';
  public static readonly studiedLanguagesKey = 'studiedLanguages';
  private readonly settings: AppSettings;

  constructor(
    primaryLanguage: string = 'en',
    primaryLocale: string = 'en-US',
    defaultStudiedLanguages: string[] = ['uk', 'ru'],
    defaultSpeechSources: SpeechSources[] = [SpeechSources.WebSpeechAPI]
  ) {
    this.settings = new AppSettings(
      primaryLanguage,
      primaryLocale,
      defaultStudiedLanguages,
      defaultSpeechSources
    );

    this.loadSettings();
  }

  public static getKeyIdentifier(key: string, ...args: string[]): string {
    // if no additional arguments, no trailing _ will be added
    const trailing = args.length > 0 ? `_${args.join('_')}` : '';
    return `${SettingsManager.keyIdentifier}_${key}${trailing}`;
  }

  private verifyColor(color: string): boolean {
    const colorRegex = /^#[0-9A-F]{6}$/i;
    return colorRegex.test(color);
  }

  /**
   * Saves only the settings object to chrome storage
   */
  public saveSettings(): void {
    chrome.storage.sync.set({
      [SettingsManager.settingsKey]: JSON.stringify(this.settings),
    });
  }

  public updateSetting(key: string, value: any, save = false): void {
    if (!Object.prototype.hasOwnProperty.call(this.settings, key)) {
      throw new Error(`SettingsManager: updateSetting: key ${key} not found`);
    }
    (this.settings as any)[key] = value;
    if (save) {
      this.saveSettings();
    }
  }

  /**
   * Loads the settings object from chrome storage
   */
  public loadSettings(): void {
    chrome.storage.sync.get(
      SettingsManager.settingsKey,
      (items: { [key: string]: any }) => {
        if (items[SettingsManager.settingsKey]) {
          const serializedSettings: AppSettings = JSON.parse(
            items[SettingsManager.settingsKey] as string
          );
          this.setSettingsFromOther(serializedSettings as AppSettings);
        }
      }
    );
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

  private setSettingsFromOther(value: AppSettings): void {
    console.log('SettingsManager: set Settings', value);
    this.settings.forvoApiKey = value.forvoApiKey;
    this.settings.forvoApiEnabled = value.forvoApiEnabled;
    this.settings.googleApiKey = value.googleApiKey;
    this.settings.googleApiEnabled = value.googleApiEnabled;
    this.settings.lingvoApiKey = value.lingvoApiKey;
    this.settings.lingvoApiEnabled = value.lingvoApiEnabled;
    this.settings.preferredVoiceGender = value.preferredVoiceGender;
    this.settings.primaryLanguage = value.primaryLanguage;
    this.settings.primaryLocale = value.primaryLocale;
    this.settings.studiedLanguages = value.studiedLanguages;
    this.settings.speechSources = value.speechSources;
    this.settings.storeAudio = value.storeAudio;
    this.settings.wordMasteryColors = value.wordMasteryColors;
  }

  public get Settings(): AppSettings {
    return this.settings;
  }

  public set Settings(value: AppSettings) {
    this.setSettingsFromOther(value);
    this.saveSettings();
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
