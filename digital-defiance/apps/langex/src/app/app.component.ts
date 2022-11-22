import { Component } from '@angular/core';
import { receiveMessages } from './shared/chromeMessaging';
import { IChromeMessage } from './shared/interfaces';

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
    receiveMessages((message: IChromeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
        console.log('AppComponent received message', message);
    });
  }
}
