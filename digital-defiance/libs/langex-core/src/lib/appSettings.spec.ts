import AppSettings from "./appSettings";
import SpeechSources from "./speechSources";
import { makeExpectedISettings } from './testUtils'

describe('AppSettings', () => {
    it('should create the app settings with the default parameters', () => {
        // arrangement is not needed
        // act
        const settings = new AppSettings();
        // assert
        expect(settings).toBeInstanceOf(AppSettings);
        expect(settings).toEqual(makeExpectedISettings());
    });
    it('should create the app settings with the specified parameters', () => {
        // arrangement is not needed
        // act
        const settings = new AppSettings('ukX', 'uk-UAX', ['enX', 'ruX'], [SpeechSources.ForvoAPI, SpeechSources.WebSpeechAPI]);
        // assert
        expect(settings).toBeInstanceOf(AppSettings);
        expect(settings.primaryLanguage).toBe('ukX');
        expect(settings.primaryLocale).toBe('uk-UAX');
        expect(settings.studiedLanguages).toEqual(['enX', 'ruX']);
        expect(settings.speechSources).toEqual([SpeechSources.ForvoAPI, SpeechSources.WebSpeechAPI]);
    });
});
