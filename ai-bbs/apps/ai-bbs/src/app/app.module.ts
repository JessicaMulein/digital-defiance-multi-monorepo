import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TerminalComponent } from './terminal.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { AiService } from './ai.service';
import { LandingPageComponent } from './landingPage.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    TerminalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [AiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
