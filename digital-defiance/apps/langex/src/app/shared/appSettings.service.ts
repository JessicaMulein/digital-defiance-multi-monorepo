import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsManager } from './settingsManager';

const settingsManager: SettingsManager = new SettingsManager();
settingsManager.loadSettings();

@Injectable()
export class AppSettingsService {
  getSettingsManager(): Observable<SettingsManager> {
      return new Observable((observer) => {
        observer.next(settingsManager);
      });
  }
}