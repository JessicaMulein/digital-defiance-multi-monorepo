import { ISettings, SpeechSources, SupportedLanguage } from './interfaces.d';

/**
 * Use browser/chrome storage to store settings
 */
export class SettingsManager {
  private static readonly initializeKey = '__initialized';
  private readonly settings: ISettings;
  constructor(
    defaultLanguages: SupportedLanguage[] = [SupportedLanguage.English],
    defaultSpeechSources: SpeechSources[] = [SpeechSources.WebSpeechAPI]
  ) {
    this.settings = {
      color: '#3aa757',
      lingvoApiKey: '',
      forvoApiKey: '',
      languages: defaultLanguages,
      speechSources: defaultSpeechSources,
    };

    this.load();
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
