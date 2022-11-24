import 'jest-preset-angular/setup-jest';
import * as chrome from 'sinon-chrome';

(global as any).chrome = chrome;
(window as any).chrome = chrome;