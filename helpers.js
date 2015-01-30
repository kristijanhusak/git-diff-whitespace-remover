/* jshint unused: false */
/* global chrome */
'use strict';

/**
 * @param {String} url
 * @param {String|Array} needle - string or array to find in the url
 */
function urlHas(url, needle) {
  if (needle && needle instanceof Array) {
    var len = needle.length;
    for (var i = 0; i < len; i++) {
      if (url.indexOf(needle[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  return url.indexOf(needle) !== -1;
}

/**
 * @param {String} url
 */
function isValidUrl(url) {
  if (!url) {
    return false;
  }

  if (urlHas(url, 'github.com')) {

    if (urlHas(url, 'commits/') || urlHas(url, 'pulls')) {
      return false;
    }

    if (urlHas(url, 'commit') || urlHas(url, 'pull')) {
      return true;
    }
  }

  if (urlHas(url, 'bitbucket.org')) {

    if (urlHas(url, ['pull-requests', 'commits/all', 'commits/branch'])) {
      return false;
    }

    if (urlHas(url, ['commits', 'pull-request'])) {
      return true;
    }
  }

  return false;
}

/**
 * @param {String} url
 */
function hasQueryString(url) {
  return urlHas(url, ['?w=1', '&w=1']);
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

/**
 * @param {String} text - used for badge in the icon
 */
function setBadgeAndBtn(text, btn) {
  text = text || '';

  if (text === '') {
    if (btn) {
      btn.innerHTML = 'Not available';
      btn.setAttribute('disabled', true);
      btn.classList.remove('set-on', 'set-off');
    }
    return chrome.browserAction.setBadgeText({text: ''});
  }

  if (btn) {
    btn.removeAttribute('disabled');
  }

  if (text === 'on') {
    if (btn) {
      btn.innerHTML = 'Disable';
      btn.classList.remove('set-on');
      btn.classList.add('set-off');
    }
    chrome.browserAction.setBadgeBackgroundColor({color: [0, 255, 0, 255]});
    return chrome.browserAction.setBadgeText({text: 'On'});
  }

  if (text === 'off') {
    if (btn) {
      btn.innerHTML = 'Enable';
      btn.classList.remove('set-off');
      btn.classList.add('set-on');
    }
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    return chrome.browserAction.setBadgeText({text: 'Off'});
  }
}

/**
 * @param {function(tab)} callback - function triggered after tab is fetched
 */
function currentTab(callback) {
  chrome.tabs.getSelected(null, callback);
}

/**
 * @param {Object} tab - currently selected tab
 * @param {Object} btn - button to toggle on and off(Optional)
 */
function updatePopupState(tab, btn) {
    var url = tab.url;

    if (!isValidUrl(url)) {
      return setBadgeAndBtn(null, btn);
    }

    if (hasQueryString(url)) {
      return setBadgeAndBtn('on', btn);
    }

    return setBadgeAndBtn('off', btn);
}
