import * as $ from 'jquery';
import { WordMasteryStatus } from './interfaces';


export function makeTranslateLink(text: string, source: string, target: string): string {
  const encoded = encodeURIComponent(text);
  return `https://translate.google.com/?op=translate&sl=${source}&tl=${target}&text=${encoded}`;
}

/**
// function that handles selection search
 * @param info 
 * @param tab 
 */
export function googleTranslateLookup(
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab | undefined
) {
  console.log(info, tab);
  const source = 'uk';
  const target = 'en';
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

  public async postLanguageDetection(text: string | string[]): Promise<chrome.i18n.LanguageDetectionResult[]> {
    if (!this.authenticated) {
      this.authenticate();
      if (!this.authenticated) {
        throw new Error('Authentication failed');
      }
    }
    throw new Error('Method not implemented.');
    const url = 'https://translation.googleapis.com/language/translate/v2/detect';
    // post to the url
    const results: chrome.i18n.LanguageDetectionResult[] = [];
    // await $.ajax({
    //   method: 'POST',
    //   url: url,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${this.apiKey}`
    //   }
    // }, { q: text }, (data) => {
    //   data.data.detections.forEach((detection: GoogleDetectionResult) => {
    //     results.push(detection);
    //   });
    // });
    return results;
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
