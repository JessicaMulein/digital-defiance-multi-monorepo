import { Component } from '@angular/core';
import { translate } from '@vitalets/google-translate-api';
import { receiveMessages } from 'libs/langex-core/src/lib/chromeMessaging';
import { IChromeMessage } from 'libs/langex-core/src/lib/interfaces';

@Component({
  selector: 'digital-defiance-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'langex';
  constructor() {
    console.log('AppComponent constructor');
    chrome.runtime.connect({ name: 'langex' });
    receiveMessages(
      (
        message: IChromeMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
      ) => {
        console.log('AppComponent received message', message);
      }
    );
  }
  public async testTranslate() {
    const { text } = await translate('Привет, мир! Как дела?', { to: 'en' });

    console.log(text); // => 'Hello World! How are you?'
  }
}
