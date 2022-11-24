import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import MessageContext from 'libs/langex-core/src/lib/messageContext';
import { SettingsManager } from 'libs/langex-core/src/lib/settingsManager';

const settingsManager: SettingsManager = new SettingsManager(MessageContext.Extension);
settingsManager.loadGlobalSettings();

@Injectable()
export class AppSettingsService {
  getSettingsManager(): Observable<SettingsManager> {
      return new Observable((observer) => {
        observer.next(settingsManager);
      });
  }
}