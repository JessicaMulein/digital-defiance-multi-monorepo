import { bestGuessSourceLanguage, detectLanguage2 } from "./languages";

export function makeLingvoLink(text: string, source: string, target: string): string {
  // take only the first word from text
  const word = encodeURIComponent((text || '').split(' ')[0]);
  return `https://www.lingvolive.com/en-us/translate/${source}-${target}/${word}`;
}

/**
// function that handles selection search
 * @param info 
 * @param tab 
 */
export function lingvoLookup(
  currentLanguage: string,
  studiedLanguages: string[],
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab | undefined
) {
  console.log(info, tab);
  const source = currentLanguage;
  const target = bestGuessSourceLanguage(currentLanguage, studiedLanguages, info.selectionText || '');
  chrome.tabs.create({
    url: makeLingvoLink(info.selectionText || '', source, target),
  });
}
