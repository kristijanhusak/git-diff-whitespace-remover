/* global chrome, setBadge, isValidUrl, hasQueryString, newUpdateUrl */
'use strict';

/**
 * @param {Object} Tab - currently selected tab
 */
function updateBadge(tab) {

  var url = tab.url;

  // Remove badge for non matching urls
  if (!url || !isValidUrl(url)) {
    return setBadge(null);
  }

  if (hasQueryString(url)) {
    return setBadge('on');
  }

  return setBadge('off');
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.getSelected(null, updateBadge);
  }
});

chrome.tabs.onActivated.addListener(function() {
  chrome.tabs.getSelected(null, updateBadge);
});

// chrome.webRequest.onBeforeRequest.addListener(function(details) {
//     return {
//       redirectUrl: newUpdateUrl(details.url)
//     };
// }, {
//   urls: ['*://bitbucket.org/*/pull-request/*', '*://bitbucket.org/*/commits/*']
// }, ['blocking']);
