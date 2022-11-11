
export enum SpeechSources {
  WebSpeechAPI = 0,
  GoogleTTS = 1,
  ForvoAPI = 2,
  ForvoScraped = 3,
}

export enum AudioStorageOption {
  None = -1,
  LocalStorage = 0,
  SyncedStorage = 1,
}

export interface DetectionResult {
  page: string;
  selection: string;
}

export interface ISettings {
  color: string;
  lingvoApiKey: string;
  forvoApiKey: string;
  /**
   * Languages to use for translation, in order of preference.
   */
  languages: string[];
  /**
   * Supported speech sources, in order of preference.
   */
  speechSources: SpeechSources[];
}

export default {
  SupportedLanguage,
  SpeechSources,
  DetectionResult,
  ISettings,
}