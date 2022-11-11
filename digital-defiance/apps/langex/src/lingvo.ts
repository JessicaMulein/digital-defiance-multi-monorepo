/**
// function that handles selection search
 * @param info 
 * @param tab 
 */
export function searchForWord(
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab | undefined
) {
  console.log(info, tab);
  const source = 'uk';
  const target = 'en';
  const word = encodeURIComponent(info.selectionText || '');
  const url = `https://www.lingvolive.com/en-us/translate/${source}-${target}/${word}`;
  chrome.tabs.create({
    url: url,
  });
}
