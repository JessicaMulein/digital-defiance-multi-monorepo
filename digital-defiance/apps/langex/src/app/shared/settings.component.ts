import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from './appSettings.service';
import MessageType from './messageType';
import { IChromeMessage } from './interfaces';
import { SettingsManager } from './settingsManager';

@Component({
  selector: 'digital-defiance-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    public static settingsManager: SettingsManager | null = null;
    private appSettingsService: AppSettingsService;
    constructor(appSettingsService: AppSettingsService) {
        this.appSettingsService = appSettingsService;
    }

    public get SettingsManager(): SettingsManager | null {
        return SettingsComponent.settingsManager;
    }

    ngOnInit(): void {
      this.appSettingsService.getSettingsManager().subscribe({
        next(manager) {
          SettingsComponent.settingsManager = manager;
          console.log('SettingsComponent: settingsManager loaded in app', manager.Settings);
        },
        error(err) {
          console.error(err);
        },
        complete() {
          console.log('complete');
        }
      });
    }
    
    saveSetting(): void {
      if (!SettingsComponent.settingsManager) {
        throw new Error('SettingsManager not initialized');
      }
      SettingsComponent.settingsManager.saveSettings();
      const message: IChromeMessage = {
        type: MessageType.SettingsUpdate,
        data: null
      };
      chrome.runtime.sendMessage(message);
    }
}
