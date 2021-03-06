/* jshint unused: false */
/* global chrome */
'use strict';

/**
 * Split url by hash so it can be properly constructed
 */
function splitByHash(url) {
  if (url.indexOf('#') !== -1) {
    var urlParts = url.split('#');

    return {
      url: urlParts[0],
      hash: '#' + urlParts[1]
    };
  }

  return {
    url: url,
    hash: ''
  };
}

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

    if (urlHas(url, ['commits/', 'pulls'])) {
      return false;
    }

    if (urlHas(url, ['commit', 'pull'])) {
      return true;
    }
  }

  if (urlHas(url, 'bitbucket.org')) {
    if (urlHas(url,
      ['commits/all', 'commits/branch'])
    ) {
      return false;
    }

    if (urlHas(url, ['commits', 'pull-requests'])) {
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
 * Update url manually
 *
 * @param {Object} Tab - currently selected tab
 */
function updateUrl(tab) {
  var urlParts = splitByHash(tab.url);
  var url = urlParts.url;

  if (hasQueryString(url)) {

    var toBeDeleted = urlHas(url, '?w=1') ? '?w=1' : '&w=1';

    var newUrl = url.replace(toBeDeleted, '');

    return chrome.runtime.sendMessage({
      redirect: newUrl + urlParts.hash,
      tab: tab
    });
  }

  var queryString = !urlHas(url, '?') ? '?w=1' : '&w=1';

  return chrome.runtime.sendMessage({
    redirect: url + queryString + urlParts.hash,
    tab: tab
  });
}

/**
 * @param {String} text - used for badge in the icon
 * @param {Object} btn - Btn in the popup
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
      btn.innerHTML = 'Show whitespace';
      btn.classList.remove('set-on');
      btn.classList.add('set-off');
    }
    chrome.browserAction.setBadgeBackgroundColor({color: [0, 255, 0, 255]});
    return chrome.browserAction.setBadgeText({text: 'On'});
  }

  if (text === 'off') {
    if (btn) {
      btn.innerHTML = 'Hide whitespace';
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
  chrome.tabs.query({active: true}, function(tabs) {
    callback(tabs[0]);
  });
}

/**
 * Function used in beforeRequest when automatic is set
 * @param {String} url - requested url
 * @param {Boolean} autoUpdate - is automatic update enabled
 */
function requestUpdateUrl(url, autoUpdate) {
  if (!autoUpdate || !isValidUrl(url)) {
    return url;
  }

  if (hasQueryString(url)) {
    return url;
  }

  var urlParts = splitByHash(url);

  var queryString = !urlHas(urlParts.url, '?') ? '?w=1' : '&w=1';

  return urlParts.url + queryString + urlParts.hash;
}

/**
 * @param {Boolean} flag - save automatic setup setting to storage
 * @param {function()} callback - triggered after save is finished
 */
function setAutomatic(flag, callback) {
  chrome.storage.local.set({'gitDiffWhitespaceRemover': flag}, callback);
}

/**
 * @param {function(isAutomatic)} callback - fetch if automatic set and trigger
 */
function isAutomatic(callback) {
  chrome.storage.local.get('gitDiffWhitespaceRemover', function(data) {
    callback(data.gitDiffWhitespaceRemover);
  });
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
