import { TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { AppSettingsService } from './appSettings.service';
import { SettingsManager } from './settingsManager';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [AppSettingsService],
    }).compileComponents();
  });
  it('should create the component', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const settingsComponent = fixture.componentInstance;
    expect(settingsComponent).toBeInstanceOf(SettingsComponent);
    settingsComponent.ngOnInit();
    expect(settingsComponent.SettingsManager).toBeInstanceOf(SettingsManager);
  });
});
