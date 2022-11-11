export enum SpeechSources {
  WebSpeechAPI = 'Web speech API',
  GoogleTTS = 'Google Text to Speech',
  ForvoAPI = 'Forvo API',
  ForvoDirect = 'Forvo direct',
}

export enum PreferredVoiceGender {
  Either = 'Either',
  Female = 'Female',
  Male = 'Male',
}

export enum AudioStorageOption {
  None = 'None',
  LocalStorage = 'Local Storage',
  SyncedStorage = 'Synced Storage',
}

export enum WordMastery {
  Unrecognized = 'Unrecognized',
  Unfamiliar = 'Unfamiliar',
  Practice = 'Practice',
  Familiar = 'Familiar',
  Mastered = 'Mastered',
}

export interface WordMasteryStatus {
  word: string;
  language: string;
  status: WordMastery;
  color: CSSStyleDeclaration.color;
}

/**
 * Each word will be highlighted with a color depending on its mastery status.
 * Ideally these will have an alpha transparency
 */
export const DefaultWordMasteryColors: {
  [key: WordMastery]: CSSStyleDeclaration.color;
} = {
  [WordMastery.Unrecognized]: '#FFFFFF', // white/page background
  [WordMastery.Unfamiliar]: 'yellow',
  [WordMastery.Practice]: 'orange',
  [WordMastery.Familiar]: 'green',
  [WordMastery.Mastered]: '#FFFFFF', // white/page background
};

export interface GoogleDetectionResult {
  confidence: number;
  isReliable: boolean;
  language: string;
}

export interface PageLanguageDetectionResult {
  page: string;
  selection: WordMasteryStatus;
}

export interface ISettings {
  wordMasteryColors: { [key: WordMastery]: CSSStyleDeclaration.color };
  lingvoApiKey: string;
  lingvoApiEnabled: boolean;
  forvoApiKey: string;
  forvoApiEnabled: boolean;
  googleApiKey: string;
  googleApiEnabled: boolean;
  /**
   * The iso 639-2 language code of the primary langauge of the speaker, which studied words will be translated to and from.
   * e.g. 'uk' for Ukrainian
   */
  primaryLanguage: string;
  /**
   * The primary language for forvo and speech synthesis
   * e.g. 'en-US' for American English
   */
  primaryLocale: string;
  preferredVoiceGender: PreferredVoiceGender;
  storeAudio: AudioStorageOption;
  /**
   * Languages being studied to use for translation, in order of preference/likelihood, not including your primary language.
   * iso369-2 codes
   */
  studiedLanguages: string[];
  /**
   * Supported speech sources, in order of preference.
   */
  speechSources: SpeechSources[];
  /**
   * The first load with default settings will be false, then they will be saved in the browser and successive loads will be true.
   * false means that the user has not yet saved their settings.
   */
  initialized?: boolean = false;
}
