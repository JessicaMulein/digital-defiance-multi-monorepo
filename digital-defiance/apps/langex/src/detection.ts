import { GoogleTranslate } from './googleTranslate';
import { DetectionResult } from './interfaces';

/**
 * Detects the language. "text" can be a string for detecting the language of
 * a single piece of text, or an array of strings for detecting the languages
 * of multiple texts.
 * @param text The text or texts to detect a language for.
 * @returns
 */
async function detectLanguage(
  text: string | string[]
): Promise<Array<DetectionResult>> {
  // try google translate
  const googleTranslate = new GoogleTranslate();
  const googleDetections = await googleTranslate.detectLanguage(text);
  // try lingvo, etc
  return googleDetections;
}
