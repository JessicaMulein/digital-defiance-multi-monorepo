import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, AfterViewChecked, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { AiService } from './ai.service';

@Component({
  selector: 'digital-defiance-ai-bbs-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('terminal', { static: false }) terminalContainer!: ElementRef;

  constructor(aiService: AiService, renderer: Renderer2) {
    this._aiService = aiService;
    this._renderer = renderer;
  }
  private readonly _renderer: Renderer2;
  private readonly _terminal: Terminal = new Terminal();
  private readonly _aiService: AiService;
  private _subscriptions: Subscription = new Subscription();

  public static writeMenu(term: Terminal) {
    console.log('writeMenu');
    // Set up the screen to display in full screen mode
    term.write('\x1b[?1049h');
    term.write('\x1b[H');

    // Set the text color and print the title
    term.write('\x1b[1;32m');
    term.write('Welcome to My ANSI BBS-Style Terminal!\r\n\r\n');
    term.write('\x1b[0m');

    // Set the text color and print the menu options
    term.write('Select an option:\r\n\r\n');
    term.write('\x1b[1;33m'); // Set text color to bright yellow
    term.write('1. Doors\r\n');
    term.write('2. Mail\r\n');
    term.write('3. News\r\n');
    term.write('4. Other Option\r\n\r\n');
    term.write('\x1b[0m'); // Reset text color to default

    // Print a prompt for the user to enter a choice
    term.write('Enter your choice (1-4): ');
  }

  public ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    const onDataSubscription = this._terminal.onData(() => {
      console.log('onData');
      // Clear the terminal and do something else when a key is pressed
      this._terminal.clear();
      TerminalComponent.writeMenu(this._terminal);
    });
    
    this._subscriptions.add(new Subscription(() => onDataSubscription.dispose()));
  }
  

  public ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked');
    if (!this.terminalContainer) {
      console.error('Container element is undefined or null');
      return;
    }

    const fitAddon = new FitAddon();

    this._terminal.loadAddon(fitAddon);
    this._terminal.open(this.terminalContainer.nativeElement);
    fitAddon.fit();
    console.log('fitAddon.fit()');
    this._terminal.write("\x1b[1;31m"); // Set text color to bright red
    this._terminal.write("Welcome to My ANSI BBS-Style Terminal!\r\n\r\n");
    this._terminal.write("\x1b[0m"); // Reset text color to default
    this._terminal.write("Press any key to continue...\r\n");
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    this._subscriptions.unsubscribe();
  }
}
