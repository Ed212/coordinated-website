// Browser-only test fixtures, serialized by Playwright's addInitScript.
// Keep the API surfaces consumed by every script on the release root intact.
export function emulateSaveData() {
  const connection = new EventTarget();
  Object.defineProperty(connection, 'saveData', {value:true});
  Object.defineProperty(navigator, 'connection', {value:connection, configurable:true});
}

export function emulateBlockedAutoplay() {
  HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Blocked', 'NotAllowedError'));
}
