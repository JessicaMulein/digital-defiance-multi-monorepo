import { ISettings, SpeechSources } from './interfaces.d';
import { languageSupported } from './languages';

/**
 * Use browser/chrome storage to store settings
 */
export class SettingsManager {
  private static readonly initializeKey = '__initialized';
  private readonly settings: ISettings;
  constructor(
    defaultLanguages: string[] = ['en'],
    defaultSpeechSources: SpeechSources[] = [SpeechSources.WebSpeechAPI]
  ) {
    if (!this.verifyLanguages(defaultLanguages)) {
      throw new Error(
        'SettingsManager: defaultLanguages must be an array of valid languages'
      );
    }
    this.settings = {
      color: '#3aa757',
      lingvoApiKey: '',
      forvoApiKey: '',
      languages: defaultLanguages,
      speechSources: defaultSpeechSources,
    };

    this.load();
  }

  private verifyLanguages(languages: string[]): boolean {
    return languages.every((language) => {
      return languageSupported(language);
    });
  }

  public save(): void {
    const serializedSettings: Record<string, unknown> = {};
    // mark as initialized
    serializedSettings[SettingsManager.initializeKey] = 'true';
    // walk through settings and serialize each value
    for (const key in this.settings) {
      const value: string = JSON.stringify((this.settings as any)[key]);
      serializedSettings[key] = value;
    }
    chrome.storage.sync.set(serializedSettings);
  }

  public load(): void {
    let initialized = false;
    chrome.storage.sync.get((items) => {
      for (const key in items) {
        const value: string = items[key];
        if (key == SettingsManager.initializeKey && value == 'true') {
          initialized = true;
        }
        if (!Object.prototype.hasOwnProperty.call(this.settings, key)) {
          continue;
        }
        (this.settings as any)[key] = JSON.parse(value);
      }
    });
    if (!initialized) {
      this.save();
    }
  }

  public update(key: string, value: any) {
    if (!Object.prototype.hasOwnProperty.call(this.settings, key)) {
      throw new Error(`SettingsManager: key ${key} does not exist`);
    }
    (this.settings as any)[key] = value;
    chrome.storage.sync.set({ [key]: JSON.stringify(value) });
  }

  public get Settings(): ISettings {
    return this.settings;
  }
}
