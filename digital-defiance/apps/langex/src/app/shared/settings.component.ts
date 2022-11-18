import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from './appSettings.service';
import MessageType from './messageType';
import { SettingsManager } from './settingsManager';
import { sendMessage } from './chromeMessaging';

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
          console.log(`SettingsComponent: settingsManager loaded in context: ${manager.context}`, manager.Settings);
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
      if (SettingsComponent.settingsManager === null) {
        throw new Error('SettingsManager not initialized');
      }
      const settingsManager = SettingsComponent.settingsManager;
      settingsManager.saveGlobalSettings();
      sendMessage({
        type: MessageType.GlobalSettingsUpdate,
        context: settingsManager.context,
        data: null
      });
    }
}
