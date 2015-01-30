/* global chrome, currentTab, updatePopupState, requestUpdateUrl, isAutomatic */
'use strict';

// Triggered when page is loaded in the tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.status === 'complete') {
    currentTab(updatePopupState);
  }
});

// Triggered on tab switch
chrome.tabs.onActivated.addListener(function() {
  currentTab(updatePopupState);
});

// Triggered with sendMessage
chrome.runtime.onMessage.addListener(function(request) {
  chrome.tabs.update(request.tab.id, {url: request.redirect});
});

isAutomatic(function(autoUpdate) {
  chrome.webRequest.onBeforeRequest.addListener(function(details) {
    return {
      redirectUrl: requestUpdateUrl(details.url, autoUpdate)
    };
  }, {
    urls: [
      '*://bitbucket.org/*/pull-request/*',
      '*://bitbucket.org/*/commits/*',
      '*://github.com/*/pull/*',
      '*://github.com/*/commit/*'
    ]
  }, ['blocking']);
});
