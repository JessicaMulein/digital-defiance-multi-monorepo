import { TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { AppSettingsService } from './appSettings.service';

describe('AppComponent', () => {
  beforeEach(async () => {
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
