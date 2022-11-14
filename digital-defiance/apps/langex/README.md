# langex

```text
  path: nx-monorepo/digital-defiance/apps/langex
```

link: <https://github.com/Digital-Defiance/nx-monorepo/tree/main/digital-defiance/apps/langex#readme>

## LangEx- LanguageExtension. Learn new languages in your browser while reading any page

LangEx is a Chrome (and derivatives like Edge) Extension to help you extend your reading comprehension in any language.

We will go into more detail in another section, but the main goal of this extension is to do two things:

1) Allow right-clicking on any word or selection to provide quick access to definitions and pronunciations from API providers, language websites, and even text to speech synthesis APIs.
2) If enabled and the page is detected as a language you are studying, every word of that language will be shaded with a color/transparency highlight indicating your knowledge level of that word from unidentifiable to mastered. Right clicking the word will also let you set your mastery level.

## Caveats and important licensing

* It is designed for personal use specifically with the author (Jessica Mulein) learning Ukrainian by reading posts on sites like reddit, mastodon, and typical news sites. We (royal We) will endeavor to make this work with any of the iso639 languages.
* This extension will be especially helpful for those wishing to learn Cyrillic languages like Ukranian, Russian, etc. We interface with Forvo and Ligvo which are specifically helpful for those languages. It is also likely to be very useful for a Ukrainian or Russian speaker to learn English if We build this correctly.
  * <https://www.lingvolive.com/en-us/translate/uk-en/%D0%B4%D0%BE%D1%81%D0%B2%D1%96%D0%B4%D1%87%D0%B5%D0%BD%D1%96%D1%81%D1%82%D1%8C>;
  * <https://forvo.com/word/%D0%B4%D0%BE%D1%81%D0%B2%D1%96%D0%B4%D1%87%D0%B5%D0%BD%D1%96%D1%81%D1%82%D1%8C/>
  * to and from english and other languages are easy as well
* To start with, you will need to register your own API keys on forvo/lingvo/google-translate to enable those.
* If this extension works out and there is demand, perhaps We can create a website with authentication which the extension will sign into and then do lookups for you on the backend using API keys We will then have to buy with donations/subscriptions. Everything would be encrypted e2e and processed then locally probably on a google service against google apis. That will increase the complexity.

## How it works, currently

* When you click the extension in your toolbar, a small popup with settings will appear where you can customize the colors and change options like what languages you want to study and have highlighting for as well as enabling/disabling various features.
* The current page is analyzed (in-browser, no external queries) for metadata tags for the language and other indications like the unicode character set being used for each word.
* As long as the extension is enabled, regardless of the page language, any word can be right-clicked and a few search options will be added to your context menu such as defining the word using Google Translate, Lingvo, Forvo, et cetera depending on what is enabled.

* If enabled and the current page is detected as one you are studying, it will go through the current page and highlight any words detected that are in languages you are studying. Each word is shaded according to the mastery level you mark for each word.
  * It only pays attention to languages you have marked that you are studying.
    For instance if your primary language is English, you would not mark that as one you are studying.
    You might add Ukrainian as a language you are studying and then when you are on a page marked/detected as Ukrainian, and then the highlighting will activate.

## Developing

1) Clone the repository:
  ```git clone https://github.com/Digital-Defiance/nx-monorepo.git```
2) Open the nx-monorepo folder/directory with Visual Studio Code.
3) In a terminal, making sure you are in the root of the repository:

  ```text
  % cd digital-defiance
  % yarn
  % cd apps/langex
  % yarn
  ```

### Building

From digital-defiance/apps/langex:
  ```% npx nx build```

### Unit Testing

From digital-defiance/apps/langex:
  ```% npx nx test --coverage```
  The --coverage argument is optional, but will result in digital-defiance/coverage/apps/langex being filled with coverage html files.

  These can be viewed by changing to that folder/directory and running:
  ```% npx http-server```

  Then visiting the localhost address and port printed out, usually you can hover over the address and there will be an option to press a command/control key and click to open in a browser.

### Testing in the browser

After doing a build as above:

1) Open Chrome
2) Go to 'Manage Extensions' under the top right menu.
3) Make sure developer mode is toggled on.
4) Click 'Load unpacked'.
5) Select the nx-monorepo/digital-defiance/dist/apps/langex folder/directory

### End to end testing

Currently not functional.
In digital-defiance/apps/langex-e2e:
```% npx nx run langex:e2e```
