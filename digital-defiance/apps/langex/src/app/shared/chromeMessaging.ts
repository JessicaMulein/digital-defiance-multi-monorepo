import { IChromeMessage } from './interfaces';

export function sendMessage(message: IChromeMessage): void {
  chrome.runtime.sendMessage(message);
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