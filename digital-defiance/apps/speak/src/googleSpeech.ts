import { GoogleAuth } from "google-auth-library";
import { TextToSpeechClient, protos, v1 as ttsV1 } from "@google-cloud/text-to-speech";
import { environment } from "./environments/environment"

/**
 * https://codelabs.developers.google.com/codelabs/cloud-text-speech-node
 */
export class GoogleSpeech
{
    private readonly client: TextToSpeechClient;
    private languageCode: string;
    private preferredGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender;
    public constructor() {
        this.languageCode = environment.googleSpeech.languageCode;
        const keyIndex = Object.keys(protos.google.cloud.texttospeech.v1.SsmlVoiceGender).indexOf(environment.googleSpeech.preferredSpeechGender);
        if (keyIndex === -1) {
            throw new Error(`Invalid preferred speech ${environment.googleSpeech.preferredSpeechGender}`);
        }
        const genderValue = Object.values(protos.google.cloud.texttospeech.v1.SsmlVoiceGender)[keyIndex];
        if (genderValue === undefined || typeof genderValue === 'string') {
            throw new Error(`Invalid preferred speech ${environment.googleSpeech.preferredSpeechGender}`);
        }
        this.preferredGender = genderValue;
        this.client = new TextToSpeechClient();
    }

    public async speak(text: string, audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding = protos.google.cloud.texttospeech.v1.AudioEncoding.MP3): Promise<Buffer|undefined>
    {
        const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
            input: {text: text},
            voice: {
                languageCode: this.languageCode,
                ssmlGender: this.preferredGender
            },
            audioConfig: {
                audioEncoding: audioEncoding
            },
        };

        const [response] = await this.client.synthesizeSpeech(request);
        if (response === undefined || response.audioContent === undefined || response.audioContent === null) {
            return undefined;
        }
        return Buffer.from(response.audioContent);
    }
}