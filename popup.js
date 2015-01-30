/* global chrome, updateUrl, updatePopupState, currentTab */
'use strict';

function onDomLoaded() {
  var btn = document.getElementById('toggle-button');

  currentTab(function(tab) {
    updatePopupState(tab, btn);
  });

  btn.addEventListener('click', function(e) {
    e.preventDefault();

    currentTab(function(tab) {
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
