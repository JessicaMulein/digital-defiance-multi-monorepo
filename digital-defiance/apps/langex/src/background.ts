// src/background.ts
/// <reference types="chrome"/>
const color = '#3aa757'
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color })
  console.log('Default background color set to %cgreen', `color: ${color}`)
    // create new menu
    chrome.contextMenus.create({
      id: 'searchForWord',
      title: 'Search DuckDuckGo for: %s',
      contexts: ['selection'],
    })
})

// function that handles selection search
const searchForWord = (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => {
  // create a new tab with selection text for searching 
  chrome.tabs.create({
     url: 'https://duckduckgo.com/?q=' + info.selectionText,
   })
 }
 // event handling for menu
 chrome.contextMenus.onClicked.addListener(searchForWord)