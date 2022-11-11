// src/background.ts
/// <reference types="chrome"/>

// Imports the Google Cloud client library
import { v2 as TranslateV2 } from '@google-cloud/translate';
import * as $ from 'jquery';

// Creates a client
const translator = new TranslateV2.Translate();

enum SupportedLanguage {
  UnknownUnsupported = '',
  English = 'en',
  Russian = 'ru',
  Ukrainian = 'uk',
}

interface DetectionResult {
  page: SupportedLanguage;
  selection: SupportedLanguage;
}
interface ISettings {
  color: string;
  lingvoKey: string;
  languages: SupportedLanguage[];
}

const settings: ISettings = {
  color: '#3aa757',
  lingvoKey: '',
  languages: [SupportedLanguage.Ukrainian, SupportedLanguage.English, SupportedLanguage.Russian],
}

async function getForvoSoundSources(text: string): Promise<string | null>
{
  const url = 'https://forvo.com/search/' + encodeURIComponent(text) + '/ja';
  let result: string | null = null;
  await $.ajax(url).done(function(data) {
        const play = $(data).find('.results_match .play');

        if (play.length == 0)
        {
            result = null;
            return;
        }

        const onclickAttr = play.first().attr('onclick');
        if (onclickAttr === undefined) {
          result = null;
          return;
      }
        const raw = onclickAttr.split("'");
        const audio_obj = $('<audio>');
        if ( raw[5] != '' )
        {
            const mp3h = 'https://audio00.forvo.com/audios/mp3/' + encodeURIComponent(Buffer.from(raw[5], 'base64').toString('ascii'));
            audio_obj.append($('<source>').attr('src', mp3h).attr('type', 'audio/mpeg'));
        }
        if ( raw[7] != '' )
        {
            const oggh = 'https://audio00.forvo.com/audios/ogg/' + encodeURIComponent(Buffer.from(raw[7], 'base64').toString('ascii'));
            audio_obj.append($('<source>').attr('src', oggh).attr('type', 'audio/ogg'));
        }
        const mp3l = 'https://audio00.forvo.com/mp3/' + encodeURIComponent(Buffer.from(raw[1], 'base64').toString('ascii'));
        audio_obj.append($('<source>').attr('src', mp3l).attr('type', 'audio/mpeg'));
        const oggl = 'https://audio00.forvo.com/ogg/' + encodeURIComponent(Buffer.from(raw[3], 'base64').toString('ascii'));
        audio_obj.append($('<source>').attr('src', oggl).attr('type', 'audio/ogg'));
        result = audio_obj[0].outerHTML;
    });
    return result;
}

/**
 * Detects the language. "text" can be a string for detecting the language of
 * a single piece of text, or an array of strings for detecting the languages
 * of multiple texts.
 * @param text The text or texts to detect a language for.
 * @returns 
 */
async function detectLanguage(text: string | string[]): Promise<Array<DetectionResult>> {
   const [detections] = typeof text === 'string' ? await translator.detect(text) : await translator.detect(text);
   const detectionsArray = Array.isArray(detections) ? detections : [detections];
   console.log('Detections:');
   const detectionResults: Array<DetectionResult> = [];
   detectionsArray.forEach((detection) => {
    console.log(`${detection.input} => ${detection.language}`);
    detectionResults.push({
      page: SupportedLanguage.UnknownUnsupported,
      selection: SupportedLanguage.UnknownUnsupported,
    });
   });
   return detectionResults;
}

chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  chrome.storage.sync.get((items) => {
    const tmp = items as ISettings;
    if (!tmp.lingvoKey || tmp.lingvoKey === '') {
      console.log('need lingvo key');
      chrome.storage.sync.set(settings)
      return;
    }
    settings.color = (items as ISettings).color
    settings.lingvoKey = (items as ISettings).lingvoKey
  });
  console.log('Default background color set to %cgreen', `color: ${settings.color}`)
    // create new menu
    chrome.contextMenus.create({
      id: 'searchForWord',
      title: 'Translate: %s',
      contexts: ['selection'],
    })
})

// function that handles selection search
const searchForWord = (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => {
  console.log(info);
  const source = 'uk';
  const target = 'en';
  const word = encodeURIComponent(info.selectionText || '');
  const url = `https://www.lingvolive.com/en-us/translate/${source}-${target}/${word}`;
  chrome.tabs.create({
    url: url
  });
 }
 // event handling for menu
 chrome.contextMenus.onClicked.addListener(searchForWord)

// let busy = false;
//
// function add_links()
// {
//     $('#primary .concept_light-wrapper, .page .concept_light-wrapper').each(function() {
//         if ($(this).parent().find('.forvo').length > 0) {
//             return;
//         }

//         const word = $(this).find('.concept_light-readings .text').text().trim();
//         const href = $('<a class="forvo concept_light-status_link">Play on Forvo</a>').insertBefore($(this).parent().find('.concept_light-status > a').first());
//         href.click(function() {
//             if (busy)
//             {
//                 return;
//             }

//             busy = true;
//             chrome.runtime.sendMessage(null, {word: word}, function(obj) {
//                 busy = false;
//                 if (obj !== null) {
//                     $('#forvo').html(obj);
//                     $('#forvo audio')[0].play();
//                 }
//                 else
//                 {
//                     href.text('Word not found');
//                 }
//             }.bind(this));
//         });
//     });
// }

// $(function() {
//     add_links();

//     const observer = new MutationObserver(function(mutations) {
//         add_links();
//     });

//     observer.observe($('body')[0], { subtree:true, childList: true });
//     $('<div id="forvo"/>').appendTo('body');
// });
//  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  

//   return true;
// });