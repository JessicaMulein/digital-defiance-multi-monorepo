import 'jest-preset-angular/setup-jest';
import * as chrome from 'sinon-chrome';

Object.assign(global, chrome);
Object.assign(window, chrome);
(global as any).chrome = chrome;
(window as any).chrome = chrome;
