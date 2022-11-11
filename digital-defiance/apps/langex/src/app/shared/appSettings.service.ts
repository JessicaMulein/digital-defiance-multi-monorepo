import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { SettingsManager } from './settingsManager';
import { SpeechSources } from './interfaces.d';

const settingsManager: SettingsManager = new SettingsManager(
    'en',
    'en-US',
    ['uk', 'ru'],
    [
      SpeechSources.WebSpeechAPI,
      SpeechSources.GoogleTTS,
      SpeechSources.ForvoAPI,
      SpeechSources.ForvoDirect,
    ]
  );
settingsManager.loadSettings();

@Injectable()
export class AppSettingsService {
  getSettingsManager(): Observable<SettingsManager> {
      return new Observable((observer) => {
        observer.next(settingsManager);
      });
  }
}