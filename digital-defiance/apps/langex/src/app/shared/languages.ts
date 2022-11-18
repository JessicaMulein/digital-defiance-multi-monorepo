import { isValid } from 'all-iso-language-codes';
import { WordMasteryStatus } from './interfaces';

export function languageSupported(language: string): boolean {
  const result = isValid(language);
  if (typeof result === 'boolean') {
    return result;
  } else if (typeof result === 'object') {
    return result.found;
  } else {
    return false;
  }
}

/**
 * Detects the language. "text" can be a string for detecting the language of
 * a single piece of text, or an array of strings for detecting the languages
 * of multiple texts.
 * @param text The text or texts to detect a language for.
 * @returns
 */
export async function detectLanguage(
  text: string | string[],
  /**
   * if an array of strings is passed in and are predominately one language then indeterminate results will be swayed towards the mean language
   */
  swayByMean: boolean = false
): Promise<Record<string, WordMasteryStatus>> {
  throw new Error('Method not implemented.');
  // // try google translate
  // const googleTranslate = new GoogleTranslate();
  // const googleDetections = await googleTranslate.detectLanguage(text);
  // // try lingvo, etc
  // const detections: Record<string, string> = {};
  // const wordCounts: Record<string, number> = {};
  // googleDetections.forEach((detection) => {
  //   detections[detection.input] = detection.language;
  //   if (wordCounts[detection.language]) {
  //       wordCounts[detection.language] += 1;
  //   } else {
  //       wordCounts[detection.language] = 1;
  //   }
  // });
  // if (swayByMean) {
  //   // determine the language with the largest number of words
  //       let maxCount = 0;
  //       let maxLanguage = '';
  //       Object.keys(wordCounts).forEach((language) => {
  //           if (wordCounts[language] > maxCount) {
  //               maxCount = wordCounts[language];
  //               maxLanguage = language;
  //           }
  //       });
  //       // go through the detections and look for indeterminate results
  //       googleDetections.forEach((detection) => {
  //           if (detection.language === 'und') {
  //               //
  //           }
  //       });
  //   }
  // return detections;
}

export function detectLanguage2(inputText: string): chrome.i18n.DetectedLanguage[] {
  const langList: chrome.i18n.DetectedLanguage[] = [];
  chrome.i18n.detectLanguage(inputText, function(result) {
    for(let i = 0; i < result.languages.length; i++) {
      langList.push(result.languages[i])
    }
  });
  return langList;
}

// detect by div, span, p, etc?
// break page into hunks, detect language of each hunk, then determine language of page by majority vote?