chrome.runtime.onInstalled.addListener(() => {
  console.log('SPIKE Caret Broadcaster installed');
});

// Inject content script on SPIKE tab activation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (changeInfo.status === 'complete' && tab.url && /https:\/\/spike\.legoeducation\.com\/prime\/project/.test(tab.url)) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['spike-content.js']
      });
    }
  } catch (e) {}
});
