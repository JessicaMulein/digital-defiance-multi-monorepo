import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppSettingsService } from './shared/appSettings.service';
import { SettingsComponent } from './shared/settings.component';

@NgModule({
  declarations: [AppComponent, SettingsComponent],
  imports: [BrowserModule],
  providers: [AppSettingsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
