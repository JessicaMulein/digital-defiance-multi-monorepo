import {
  DefaultWordMasteryColors,
  ISettings,
} from './interfaces.d';
import AudioStorageOption from './audioStorageOption';
import PreferredVoiceGender from './preferredVoiceGender';
import SpeechSources from './speechSources';
import WordMastery from './wordMastery';

export default class AppSettings implements ISettings {
  public lingvoApiKey: string;
  public lingvoApiEnabled: boolean;
  public forvoApiKey: string;
  public forvoApiEnabled: boolean;
  public googleApiKey: string;
  public googleApiEnabled: boolean;
  /**
   * The iso 639-2 language code of the primary langauge of the speaker, which studied words will be translated to and from.
   * e.g. 'uk' for Ukrainian
   */
  public primaryLanguage: string;
  /**
   * The primary language for forvo and speech synthesis
   * e.g. 'en-US' for American English
   */
  public primaryLocale: string;
  public preferredVoiceGender: PreferredVoiceGender;
  public storeAudio: AudioStorageOption;
  /**
   * Languages being studied to use for translation, in order of preference/likelihood, not including your primary language.
   * iso369-2 codes
   */
  public studiedLanguages: string[];
  /**
   * Supported speech sources, in order of preference.
   */
  public speechSources: SpeechSources[];
  public wordMasteryColors: Record<WordMastery, string>;

  constructor(
    primaryLanguage: string = 'en',
    primaryLocale: string = 'en-US',
    defaultStudiedLanguages: string[] = ['uk', 'ru'],
    defaultSpeechSources: SpeechSources[] = [SpeechSources.WebSpeechAPI]
  ) {
    this.lingvoApiKey = '';
    this.lingvoApiEnabled = false;
    this.forvoApiKey = '';
    this.forvoApiEnabled = false;
    this.googleApiKey = '';
    this.googleApiEnabled = false;
    this.primaryLanguage = primaryLanguage;
    this.primaryLocale = primaryLocale;
    this.preferredVoiceGender = PreferredVoiceGender.Either;
    this.storeAudio = AudioStorageOption.None;
    this.studiedLanguages = defaultStudiedLanguages;
    this.speechSources = defaultSpeechSources;
    this.wordMasteryColors = DefaultWordMasteryColors;
  }
}
