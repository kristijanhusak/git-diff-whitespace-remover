/* global chrome, setBadge, isValidUrl, updateUrl, hasQueryString */
'use strict';

function onDomLoaded() {

  var btn = document.getElementById('toggle-button');

  /**
   * @param {Object} tab - current tab
   */
  function updateBtnText(tab) {
    var url = tab.url;

    if (!isValidUrl(url)) {
      btn.innerHTML = 'Not available here';
      btn.setAttribute('disabled', true);
      btn.classList.remove('set-on', 'set-off');
      return setBadge(null);
    }

    btn.removeAttribute('disabled');
    if (hasQueryString(url)) {
      btn.innerHTML = 'Disable';
      btn.classList.remove('set-on');
      btn.classList.add('set-off');
      return setBadge('on');
    }

    btn.innerHTML = 'Enable';
    btn.classList.add('set-on');
    btn.classList.remove('set-off');
    setBadge('off');
  }

  chrome.tabs.getSelected(null, updateBtnText);

  btn.addEventListener('click', function(e) {
    e.preventDefault();

    chrome.tabs.getSelected(null, function(tab) {
      updateUrl(tab);
      window.close();
    });
  });

  /**
   * Listener for message events
   */
  chrome.runtime.onMessage.addListener(function(request) {
    chrome.tabs.update(request.tab.id, {url: request.redirect});
  });
}

document.addEventListener('DOMContentLoaded', onDomLoaded);
