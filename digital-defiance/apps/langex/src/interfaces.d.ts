export enum SupportedLanguage {
  UnknownUnsupported = '',
  English = 'en',
  Russian = 'ru',
  Ukrainian = 'uk',
}

export interface DetectionResult {
  page: SupportedLanguage;
  selection: SupportedLanguage;
}

export interface ISettings {
  color: string;
  lingvoKey: string;
  languages: SupportedLanguage[];
}
