export function makeLingvoLink(text: string, source: string, target: string): string {
  const word = encodeURIComponent(text || '');
  return `https://www.lingvolive.com/en-us/translate/${source}-${target}/${word}`;
}

/**
// function that handles selection search
 * @param info 
 * @param tab 
 */
export function lingvoLookup(
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab | undefined
) {
  console.log(info, tab);
  const source = 'uk';
  const target = 'en';
  chrome.tabs.create({
    url: makeLingvoLink(info.selectionText || '', source, target),
  });
}
