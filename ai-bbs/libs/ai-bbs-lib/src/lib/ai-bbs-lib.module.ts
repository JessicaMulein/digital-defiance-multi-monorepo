import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import * as figlet from 'figlet';
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionRequest,
  CreateChatCompletionResponseChoicesInner,
  OpenAIApi,
} from 'openai';

function ready() {
  console.log(figlet.textSync('ASCII'));
  console.log(figlet.textSync('Art', 'Ghost'));
}

figlet.defaults({ fontPath: 'assets/fonts' });

@NgModule({
  imports: [CommonModule],
})
export class AiBbsLibModule {
  private readonly systemPrompts: ChatCompletionRequestMessage[] = [
    {
      role: 'system',
      content:
        'You are an AI running your own old fashioned bulletin board system. ' +
        'You will ask what BBS the user wants to connect to and then you will provide that experience. ' +
        'You will select one of the figlet fonts we have and you will generate ANSI menus as the user navigates this imaginary BBS. ' +
        'The user will log in on a pretend login screen and you will accept any non-empty username and password. ' +
        "Then we will generate a random menu with pretend features. When they visit them, you can choose to render imaginary data in the relevant style or make something up altogether if you can't otherwise mimic something you know. As the user navigates the site we don't need to worry about remembering what the screen looked like before if we re-visit the main menu, it might have totally different options in a totally different style this time.",
    },
  ];

  public addPrompt(prompt: ChatCompletionRequestMessage) {
    this.systemPrompts.push(prompt);
  }

  public promptUser(prompt: string, term: Terminal): string {
    // ask the user and return the answer
    term.write(prompt + '\n');
    let answer = '';
    term.onData((data: string) => {
      if (data === '\r' || data === '\n') {
        term.write('\r');
      } else {
        answer += data;
        // local echo
        term.write(data);
      }
    });
    return answer;
  }

  public writeBBSSelection(term: Terminal): string {
    term.write('\x1b[?1049h');
    term.write('\x1b[H');
    term.write('\x1b[1;32m');
    term.write('What BBS would you like to connect to?\n');
    return this.promptUser('BBS Name: ', term);
  }

  public pretendToDial(term: Terminal, bbsName: string): void {
    term.write(`Connecting to ${bbsName}...\n`);
    term.write('ATDT 555-1212\n');
    term.write('CONNECT 9600\n');
  }

  public async generateMenu(
    menuName: string,
    menuDescription: string,
    term: Terminal,
    userName: string,
    openAiKey: string,
    openAiOrg?: string
  ): Promise<string> {
    // ask OpenAI to generate a menu fitting the given name and description
    const request: CreateChatCompletionRequest = {
      messages: [
        ...this.systemPrompts,
        {
          role: 'user',
          content: `Generate a menu for "${menuName}" with the description "${menuDescription}".`,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 150,
      n: 1,
      stop: ['\r', '\n'],
    };
    const client = new OpenAIApi(new Configuration({
      apiKey: openAiKey,
      organization: openAiOrg,
    }));

    try {
      const response = await client.createChatCompletion(request);
      const choice: CreateChatCompletionResponseChoicesInner = response.data.choices[0]; 
      const menu = choice.message?.content.trim() ?? '';
      term.write(menu + '\n');
      return menu;
    } catch (error) {
      console.error('Error generating menu:', error);
      throw new Error('Error generating menu');
    }
  }
  public writeMenu(term: Terminal) {
    // Set up the screen to display in full screen mode
    term.write('\x1b[?1049h');
    term.write('\x1b[H');

    // Define the ASCII characters to use for the menu
    const borderChar = '#';
    const titleChar = '=';
    const bodyChar = '.';

    // Set the text color and print the title
    term.write('\x1b[1;32m');
    term.write(`${borderChar.repeat(80)}\r\n`);
    term.write(`${borderChar} ${titleChar.repeat(78)} ${borderChar}\r\n`);
    term.write(`${borderChar}  Welcome to My ASCII Menu!  ${borderChar}\r\n`);
    term.write(`${borderChar} ${titleChar.repeat(78)} ${borderChar}\r\n`);
    term.write(`${borderChar.repeat(80)}\r\n\r\n`);
    term.write('\x1b[0m');

    // Set the text color and print the menu options
    term.write(`${bodyChar.repeat(29)}  MENU  ${bodyChar.repeat(29)}\r\n\r\n`);
    term.write(`${bodyChar.repeat(80)}\r\n`);
    term.write(
      ` ${bodyChar} 1. Option One ${bodyChar.repeat(72)} ${bodyChar}\r\n`
    );
    term.write(
      ` ${bodyChar} 2. Option Two ${bodyChar.repeat(72)} ${bodyChar}\r\n`
    );
    term.write(
      ` ${bodyChar} 3. Option Three ${bodyChar.repeat(70)} ${bodyChar}\r\n`
    );
    term.write(
      ` ${bodyChar} 4. Option Four ${bodyChar.repeat(71)} ${bodyChar}\r\n`
    );
    term.write(`${bodyChar.repeat(80)}\r\n\r\n`);
    term.write(
      `Press a number key (1-4) to select an option, or press q to quit.\r\n\r\n`
    );
  }

  constructor() {
    //
  }

  public showMenu(term: Terminal, container: HTMLElement) {
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);
    fitAddon.fit();
    this.writeMenu(term);

    term.onData((data: string) => {
      if (data === 'q') {
        term.clear();
        term.write('Goodbye!\r\n');
      } else if (data >= '1' && data <= '4') {
        term.clear();
        term.write(`You selected option ${data}.\r\n`);
      }
    });
  }
}
