import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import MessageContext from './messageContext';
import { SettingsManager } from './settingsManager';

const settingsManager: SettingsManager = new SettingsManager(MessageContext.Extension);
settingsManager.loadSettings();

@Injectable()
export class AppSettingsService {
  getSettingsManager(): Observable<SettingsManager> {
      return new Observable((observer) => {
        observer.next(settingsManager);
      });
  }
}