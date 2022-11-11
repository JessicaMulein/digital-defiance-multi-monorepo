// Imports the Google Cloud client library
import { v2 as TranslateV2 } from '@google-cloud/translate';
import { DetectionResult } from './interfaces';

export class GoogleTranslate {
  public readonly translator: TranslateV2.Translate;

  constructor() {
    // Creates a client
    this.translator = new TranslateV2.Translate();
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
  ): Promise<Array<DetectionResult>> {
    const [detections] =
      typeof text === 'string'
        ? await this.translator.detect(text)
        : await this.translator.detect(text);
    const detectionsArray = Array.isArray(detections)
      ? detections
      : [detections];
    console.log('Detections:');
    const detectionResults: Array<DetectionResult> = [];
    detectionsArray.forEach((detection) => {
      console.log(`${detection.input} => ${detection.language}`);
      detectionResults.push({
        page: '',
        selection: detection.language,
      });
    });
    return detectionResults;
  }
}
