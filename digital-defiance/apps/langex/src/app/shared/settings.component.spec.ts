import { TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import * as chrome from 'sinon-chrome';
import { AppSettingsService } from './appSettings.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    (global as any).chrome = chrome;
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [AppSettingsService],
    }).compileComponents();
  });
  it('should create the component', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const settingsManager = fixture.componentInstance;
    expect(settingsManager).toBeTruthy();
  });
});
