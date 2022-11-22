import { IChromeMessage } from './interfaces';

export function sendMessageFromBackground(message: IChromeMessage): void {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    if (tabs && tabs.length > 0) {
      const tab: chrome.tabs.Tab = tabs[0];
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, message);
      } else {
        chrome.tabs.sendMessage(chrome.tabs.TAB_ID_NONE, message);
      }
    }
  });
}

export function receiveMessages(
  callback: (
    message: IChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => void
): void {
  chrome.runtime.onMessage.addListener(
    (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (typeof message !== 'object') {
        return;
      }
      const chromeMessage = message as IChromeMessage;
      if (chromeMessage.type === undefined) {
        return;
      }
      callback(chromeMessage, sender, sendResponse);
    }
  );
}