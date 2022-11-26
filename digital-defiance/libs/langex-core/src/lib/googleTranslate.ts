//import * as $ from 'jquery';
import { WordMasteryStatus } from 'libs/langex-core/src/lib/interfaces';
import { bestGuessSourceLanguage } from './languages';

export function makeTranslateLink(
  text: string,
  source: string,
  target: string
): string {
  const encoded = encodeURIComponent(text);
  return `https://translate.google.com/?op=translate&sl=${source}&tl=${target}&text=${encoded}`;
}

/**
// function that handles selection search
 * @param info 
 * @param tab 
 */
export function googleTranslateLookup(
  currentLanguage: string,
  studiedLanguages: string[],
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab | undefined
) {
  console.log(info, tab);
  const source = bestGuessSourceLanguage(
    currentLanguage,
    studiedLanguages,
    info.selectionText || ''
  );
  const target = currentLanguage;
  chrome.tabs.create({
    url: makeTranslateLink(info.selectionText || '', source, target),
  });
}

export class GoogleTranslate {
  private authenticated: boolean;
  private apiKey: string;
  constructor(apiKey: string) {
    this.authenticated = false;
    this.apiKey = apiKey;
  }

  public authenticate(): boolean {
    throw new Error('Method not implemented.');
    this.authenticated = true;
    return this.authenticated;
  }

  /**
   * Detects the language. "text" can be a string for detecting the language of
   * a single piece of text, or an array of strings for detecting the languages
   * of multiple texts.
   * @param text The text or texts to detect a language for.
   * @returns
   */
  public async detectLanguage(
    text: string | string[]
  ): Promise<Array<WordMasteryStatus>> {
    throw new Error('Method not implemented.');
  }
}
