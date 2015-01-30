/* global chrome, currentTab, updatePopupState */
'use strict';

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.status === 'complete') {
    currentTab(updatePopupState);
  }
});

chrome.tabs.onActivated.addListener(function() {
  currentTab(updatePopupState);
});
