import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AiBbsLibModule } from '@digital-defiance-ai-bbs/ai-bbs-lib'
import { Terminal } from 'xterm';
console.log(environment);

@Injectable({
  providedIn: 'root'
})
export class AiService {
    public showMenu(term: Terminal, container: HTMLElement, aiLibs: AiBbsLibModule) {
      aiLibs.showMenu(term, container);
  
      term.onData((data: string) => {
        if (data === 'q') {
          term.clear();
          term.write('Goodbye!\r');
        } else if (data >= '1' && data <= '4') {
          term.clear();
          term.write(`You selected option ${data}.\r`);
        }
      });
    }
}
