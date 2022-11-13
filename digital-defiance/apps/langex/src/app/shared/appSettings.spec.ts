import AppSettings from "./appSettings";
import SpeechSources from "./speechSources";
import PreferredVoiceGender from "./preferredVoiceGender";
import AudioStorageOption from "./audioStorageOption";
import { DefaultWordMasteryColors } from "./interfaces";

describe('AppSettings', () => {
    it('should create the app settings with the default parameters', () => {
        const settings = new AppSettings();
        expect(settings).toBeTruthy();
        expect(settings.forvoApiKey).toBe('');
        expect(settings.forvoApiEnabled).toBe(false);
        expect(settings.lingvoApiKey).toBe('');
        expect(settings.lingvoApiEnabled).toBe(false);
        expect(settings.googleApiKey).toBe('');
        expect(settings.googleApiEnabled).toBe(false);
        expect(settings.preferredVoiceGender).toBe(PreferredVoiceGender.Either);
        expect(settings.primaryLanguage).toBe('en');
        expect(settings.primaryLocale).toBe('en-US');
        expect(settings.storeAudio).toBe(AudioStorageOption.None);
        expect(settings.studiedLanguages).toEqual(['uk', 'ru']);
        expect(settings.speechSources).toEqual([SpeechSources.WebSpeechAPI]);
        expect(settings.wordMasteryColors).toEqual(DefaultWordMasteryColors);
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