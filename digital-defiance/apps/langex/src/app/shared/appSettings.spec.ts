import AppSettings from "./appSettings";
import SpeechSources from "./speechSources";

describe('AppSettings', () => {
    it('should create the app settings with the default parameters', () => {
        const settings = new AppSettings();
        expect(settings).toBeTruthy();
        expect(settings.primaryLanguage).toBe('en');
        expect(settings.primaryLocale).toBe('en-US');
        expect(settings.studiedLanguages).toEqual(['uk', 'ru']);
        expect(settings.speechSources).toEqual([SpeechSources.WebSpeechAPI]);
    });
    it('should create the app settings with the specified parameters', () => {
        const settings = new AppSettings('ukX', 'uk-UAX', ['enX', 'ruX'], [SpeechSources.ForvoAPI, SpeechSources.WebSpeechAPI]);
        expect(settings).toBeTruthy();
        expect(settings.primaryLanguage).toBe('ukX');
        expect(settings.primaryLocale).toBe('uk-UAX');
        expect(settings.studiedLanguages).toEqual(['enX', 'ruX']);
        expect(settings.speechSources).toEqual([SpeechSources.ForvoAPI, SpeechSources.WebSpeechAPI]);
    });
});
