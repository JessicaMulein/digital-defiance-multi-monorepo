export enum SupportedLanguage {
  UnknownUnsupported = '',
  English = 'en',
  Russian = 'ru',
  Ukrainian = 'uk',
}

export enum SpeechSources {
  ForvoAPI,
  ForvoScraped,
  GoogleTTS,
  WebSpeechAPI,
}

export interface DetectionResult {
  page: SupportedLanguage;
  selection: SupportedLanguage;
}

export interface ISettings {
  color: string;
  lingvoApiKey: string;
  forvoApiKey: string;
  /**
   * Languages to use for translation, in order of preference.
   */
  languages: SupportedLanguage[];
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