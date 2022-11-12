import { TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import * as chrome from 'sinon-chrome';

describe('AppComponent', () => {
  beforeEach(async () => {
    (global as any).chrome = chrome;
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
    }).compileComponents();
  });
  it('should create the component', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const settingsManager = fixture.componentInstance;
    expect(settingsManager).toBeTruthy();
  });
});
