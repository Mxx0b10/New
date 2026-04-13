// ListenFlow — Background Service Worker (Manifest V3)
// Minimal: all logic lives in the content script.
// This file is required by MV3 but has no active role in MVP.

chrome.runtime.onInstalled.addListener(() => {
  console.log('ListenFlow installed.');
});
