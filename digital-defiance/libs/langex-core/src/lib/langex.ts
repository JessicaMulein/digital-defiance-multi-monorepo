/* global chrome */
import { maskState, rulerState, addMask, addRuler, updateRulerSettings, removeRuler, removeMask, updateMaskSettings } from './reading-tools'
//import { loadVisualEngine } from './load-visual-engine'

const mousePos = {
  x: 0,
  y: 0
}

const originalElemsMap = new Map()

const cacheBody = () => {
  // cache original body if not saved
  if (!originalElemsMap.get('body')) {
    originalElemsMap.set('body', document.body.innerHTML)
  }
}

const getExtensionEnabled = async (): Promise<boolean> => {
  const { enabled } = await chrome.storage.sync.get('enabled')
  return enabled ?? true // enabled by default
}

document.addEventListener('mousemove', (event) => {
  mousePos.x = event.clientX
  mousePos.y = event.clientY
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message === 'ADAPT') {
    const enabled = await getExtensionEnabled()
    if (!enabled) {
      return
    }

    cacheBody()
    document.body.innerHTML = originalElemsMap.get('body')
    await adaptHtmlElement(document.body)

    // reading tools
    if (maskState.enabled) {
      addMask()
    }
    if (rulerState.enabled) {
      addRuler()
    }
  }
  sendResponse()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'DISABLE') {
    const elements = Array.from(document.getElementsByClassName('langex-chrome'))
    elements.forEach((element) => {
      element.classList.replace('langex-chrome', 'langex-disabled')
    })

    disableAdaptSelection()
    removeMask()
    removeRuler()
  }
  sendResponse()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'ENABLE') {
    const elements = Array.from(document.getElementsByClassName('langex-disabled'))
    elements.forEach((element) => {
      element.classList.replace('langex-disabled', 'langex-chrome')
    })

    enablelangex().catch(console.error)
  }
  sendResponse()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'RESET') {
    document.body.classList.remove('langex-chrome')

    const originalBody = originalElemsMap.get('body')
    if (originalBody) {
      document.body.innerHTML = originalBody
    }

    const styleElement = document.head.querySelector(`[data-langex-style=chrome]`)
    if (styleElement) {
      styleElement.remove()
    }
  }
  sendResponse()
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message === 'REFRESH') {
    const enabled = await getExtensionEnabled()
    if (!enabled) {
      return
    }

    // refresh current adaptation
    const adaptedElements: HTMLElement[] = Array.from(document.body.querySelectorAll('[data-langex-id]'))
    for (const element of adaptedElements) {
      // if has already adapted then revert before adapt
      const oldElemId = element.getAttribute('data-langex-id') as string
      element.innerHTML = originalElemsMap.get(oldElemId)
      originalElemsMap.delete(oldElemId)
      const originalHTML = element.innerHTML

      await adaptHtmlElement(element)

      const elemId = element.getAttribute('data-langex-id')
      originalElemsMap.set(elemId, originalHTML)
    }
  }
  sendResponse()
})

const requestSettings = async () => {
  const { settings } = await chrome.storage.local.get('settings')
  return settings
}

const listenKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Control' || event.key === 'Meta') {
    activateHighlightElement()
  } else if (event.composed && (event.ctrlKey || event.metaKey)) {
    // deactivate because is not a selection activation but a key composition (ex. Ctrl + F)
    deactivateHighlightElement()
  }
  if (event.key === 'ESC' || event.key === 'Escape') {
    deactivateHighlightElement()
  }
}

const listenKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Control' || event.key === 'Meta') {
    deactivateHighlightElement()
  }
}

const enableAdaptSelection = () => {
  document.addEventListener('keydown', listenKeyDown)
  document.addEventListener('keyup', listenKeyUp)
}

const disableAdaptSelection = () => {
  document.removeEventListener('keydown', listenKeyDown)
  document.removeEventListener('keyup', listenKeyUp)
}

const adaptElementEvent = async (event: Event) => {
  const element = event.target as HTMLElement
  element.classList.remove('langex-highlight')

  cacheBody()
  document.body.classList.add('langex-chrome')

  // revert child elems
  const childElemsAdapted = element.querySelectorAll('[data-langex-id]')
  childElemsAdapted.forEach((childElem) => {
    const childId = childElem.getAttribute('data-langex-id')
    childElem.innerHTML = originalElemsMap.get(childId)
    childElem.removeAttribute('data-langex-id')
    originalElemsMap.delete(childId)
  })

  // if is adapted by their parent do nothing
  if (element.getElementsByClassName('langex-content').length > 0 && !element.hasAttribute('data-langex-id')) {
    return
  }

  // if has already adapted then revert before adapt
  if (element.hasAttribute('data-langex-id')) {
    const elemId = element.getAttribute('data-langex-id')
    element.innerHTML = originalElemsMap.get(elemId)
  }

  const originalHTML = element.innerHTML

  await adaptHtmlElement(element)

  const elemId = element.getAttribute('data-langex-id')
  originalElemsMap.set(elemId, originalHTML)
}

const adaptHtmlElement = async (element: HTMLElement): Promise<void> => {
  document.body.classList.add('langex-loading')
  try {
    const settings = await requestSettings()
    if (settings) {
      //const visualEngine = await loadVisualEngine()
      //visualEngine.adaptHtmlElement(element, settings, 'chrome')
    }
  } catch (error) {
    console.error('Something went wrong when adapting element', element)
    console.error(error)
  }
  chrome.storage.local.set({ event: `adapt:${new Date().toISOString()}` }).catch(console.error)

  document.body.classList.remove('langex-loading')
}

const highlightElement = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target) {
    return
  }

  // prevent the child elements to be adapted twice
  const classList = Array.from(target.classList)
  if (classList.some((item) => item.includes('langex'))) {
    return
  }

  target.classList.add('langex-highlight')
  target.addEventListener('mouseout', removelangexHighlightClass(target), { once: true })
  target.addEventListener('click', adaptElementEvent, { once: true })
}

const removelangexHighlightClass = (target: Element) => () => {
  target.classList.remove('langex-highlight')
  if (target.classList.length === 0) {
    target.removeAttribute('class')
  }
  target.removeEventListener('click', adaptElementEvent)
}

const activateHighlightElement = () => {
  document.addEventListener('mouseover', highlightElement)
  const target = document.elementFromPoint(mousePos.x, mousePos.y)
  if (target) {
    const event = { target } as Partial<MouseEvent>
    highlightElement(event as MouseEvent)
  }
}

const deactivateHighlightElement = () => {
  document.removeEventListener('mouseover', highlightElement)
  const target = document.elementFromPoint(mousePos.x, mousePos.y)
  if (target) {
    removelangexHighlightClass(target)()
  }
}

// READING TOOLS
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'ADD_MASK' && !maskState.enabled) {
    if (rulerState.enabled) {
      removeRuler()
    }
    addMask()
  }
  sendResponse()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'ADD_RULER' && !rulerState.enabled) {
    if (maskState.enabled) {
      removeMask()
    }
    addRuler()
  }
  sendResponse()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'RESET') {
    removeMask()
    removeRuler()
  }
  sendResponse()
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message === 'UPDATE_MASK') {
    const { maskSettings } = await chrome.storage.sync.get('maskSettings')
    updateMaskSettings(mousePos.y, maskSettings)
  }
  sendResponse()
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message === 'UPDATE_RULER') {
    const { ruleSettings } = await chrome.storage.sync.get('ruleSettings')
    updateRulerSettings(ruleSettings)
  }
  sendResponse()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'ESC' || event.key === 'Escape') {
    removeRuler()
    removeMask()
  }
})
// end reading tools

// get extension state
getExtensionEnabled()
  .then(async (enabled) => {
    if (enabled) {
      await enablelangex()
    }
  })
  .catch(console.error)

// disable highlight element if visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    deactivateHighlightElement()
  }
})

const enablelangex = async (): Promise<void> => {
  await enableAdaptSelection()
  //await loadVisualEngine()
  const { ruleSettings } = await chrome.storage.sync.get('ruleSettings')
  await updateRulerSettings(ruleSettings)
  const { maskSettings } = await chrome.storage.sync.get('maskSettings')
  await updateMaskSettings(mousePos.y, maskSettings)
}