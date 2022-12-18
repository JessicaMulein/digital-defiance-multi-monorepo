import * as puppeteer from 'puppeteer';

let browser: puppeteer.Browser | null = null;
const getBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true,
        ignoreDefaultArgs: [
            "--mute-audio",
        ],
        args: [
            "--autoplay-policy=no-user-gesture-required",
        ],
    });
};
const log = console.log.bind(console);
getBrowser().then(() => {
    log('browser', browser);
});

// things to do:
// - configure bluetooth to connect to phone as serial port (https://towardsdatascience.com/sending-data-from-a-raspberry-pi-sensor-unit-over-serial-bluetooth-f9063f3447af)
//   - when commanded by phone, play audio
//   - when commanded by phone, list available bluetooth devices to pair to
//   - when commanded by phone, pair to bluetooth device (then automatically connect to it)
//   - when commanded by phone, connect to bluetooth paired device
//   - when commanded by phone, unpair from bluetooth device
//   - when commanded by phone, switch audio output between local audio port and bluetooth
// - configure bluetooth to connect to phone as headset 
//   - configure pulse to route browser audio to bluetooth
//   - https://raspberrypi.stackexchange.com/questions/76907/pi-as-bluetooth-headset
//   - https://github.com/lukasjapan/bt-speaker
// - route audio from bluetooth to pulse to either local audio port or headphones connected via bluetooth

// - use either Amazon Polly or Google TTS to generate audio
//   - Polly: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/polly-examples.html
//   - Google TTS: https://cloud.google.com/nodejs/docs/reference/text-to-speech/latest
// - start web server
// - get browser
//   - https://askubuntu.com/questions/1344490/headless-browser-audio-output-to-pulseaudio
//   - connect to local web server
// - when commanded by phone, generate audio, play audio
// - when audio is done playing, send message to phone to say "done playing"
// TODO: option to go word by word, sentence by sentence, or paragraph by paragraph, etc.
// TODO: save generated audio from commonly used words/phrases