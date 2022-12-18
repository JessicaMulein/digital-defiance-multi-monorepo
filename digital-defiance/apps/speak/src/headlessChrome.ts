import * as puppeteer from 'puppeteer';

export async function getBrowser(): Promise<puppeteer.Browser> {
    return await puppeteer.launch({
        headless: true,
        ignoreDefaultArgs: [
            "--mute-audio",
        ],
        args: [
            "--autoplay-policy=no-user-gesture-required",
        ],
    });
}

export function testBrowser(): puppeteer.Browser | undefined {
    let result: undefined | puppeteer.Browser = undefined;
    getBrowser().then(async (browser) => {
        result = browser;
        console.log('browser', browser);
        if (browser === undefined) {
            console.log('browser is undefined');
            return;
        }
        await browser.close();
        console.log('browser', browser);
    });
    return result;
}