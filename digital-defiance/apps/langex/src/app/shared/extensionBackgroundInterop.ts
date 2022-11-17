export function getBackgroundPage(): Window | null {
  return chrome.extension.getBackgroundPage();
}

export function getApplicationVersion(): string {
  return chrome.runtime.getManifest().version;
}

export function reloadExtension(win: Window) {
  if (win != null && win.location !== undefined) {
    return (win.location as any).reload(true);
  } else {
    return chrome.runtime.reload();
  }
}

export function connectNative(application: string): chrome.runtime.Port {
  return chrome.runtime.connectNative(application);
}

export function requestPermission(permission: any) {
  return new Promise((resolve, reject) => {
    chrome.permissions.request(permission, resolve);
  });
}
