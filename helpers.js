/* global chrome */
'use strict';

/**
 * @param {String} url
 */
function isValidUrl(url) {
  if (!url || !urlHas(url, 'bitbucket.org')) {
    return false;
  }

  if (urlHas(url, 'pull-requests') ||
      urlHas(url, 'commits/all') ||
        urlHas(url, 'commits/branch')
     ) {
       return false;
     }

     if (urlHas(url, 'commits') || urlHas(url, 'pull-request')) {
       return true;
     }

     return false;
}

/**
 * @param {String} url
 * @param {String} string - string to find in the url
 */
function urlHas(url, string) {
  return url.indexOf(string) !== -1;
}

/**
 * @param {String} url
 */
function hasQueryString(url) {
  return urlHas(url, '?w=1') || urlHas(url, '&w=1');
}

/**
 * @param {Object} Tab - currently selected tab
 */
function updateUrl(tab) {
  var url = tab.url;

  if (hasQueryString(url)) {

    var toBeDeleted = urlHas(url, '?w=1') ? '?w=1' : '&w=1';

    var newUrl = url.replace(toBeDeleted, '');

    return chrome.runtime.sendMessage({
      redirect: newUrl,
      tab: tab
    });
  }

  var queryString = !urlHas(url, '?') ? '?w=1' : '&w=1';

  return chrome.runtime.sendMessage({
    redirect: url + queryString,
    tab: tab
  });
}

function newUpdateUrl(url) {

  if (hasQueryString(url)) {
    return url;
  }

//   if (hasQueryString(url)) {
//     var toBeDeleted = urlHas(url, '?w=1') ? '?w=1' : '&w=1';
//     return url.replace(toBeDeleted, '');
//   }

  var queryString = !urlHas(url, '?') ? '?w=1' : '&w=1';

  return url + queryString;
}

/**
 * @param {String} text - used for badge in the icon
 */
function setBadge(text) {
  text = text || '';

  if (text === '') {
    return chrome.browserAction.setBadgeText({text: ''});
  }

  if (text === 'on') {
    chrome.browserAction.setBadgeBackgroundColor({color: [0, 255, 0, 255]});
    return chrome.browserAction.setBadgeText({text: 'On'});
  }

  if (text === 'off') {
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    return chrome.browserAction.setBadgeText({text: 'Off'});
  }
}
