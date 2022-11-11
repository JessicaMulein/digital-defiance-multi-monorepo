import * as Forvo from './forvo';
import { SupportedLanguage } from './interfaces';

/**
 * Gets the pronunciation of the given text in the given language.
 * TODO: Add Google Translate support.
 * TODO: Pay for Forvo API access, support official API and scraping
 */
export class Pronunciation {
  public static async getWordSoundSources(
    language: SupportedLanguage,
    text: string
  ): Promise<string | null> {
    return await Forvo.scrapeForvoWordSoundSources(language, text);
  }

  public static async getSearchSoundSources(
    language: SupportedLanguage,
    text: string
  ): Promise<string | null> {
    return await Forvo.scrapeForvoSearchSoundSources(language, text);
  }
}
