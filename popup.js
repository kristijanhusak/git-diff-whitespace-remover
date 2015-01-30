/* global chrome */
/* global updateUrl */
/* global updatePopupState */
/* global currentTab */
/* global setAutomatic */
/* global isAutomatic */
'use strict';

function onDomLoaded() {
  var btn = document.getElementById('toggle-button');
  var autoSet = document.getElementById('auto-set');
  var currTab;

  currentTab(function(tab) {
    currTab = tab;
    updatePopupState(currTab, btn, autoSet);
  });

  isAutomatic(function(autoUpdate) {
    if (autoUpdate) {
      autoSet.checked = true;
      btn.style.display = 'none';
    } else {
      autoSet.checked = false;
      btn.style.display = 'block';
    }
  });

  autoSet.addEventListener('change', function() {
    setAutomatic(this.checked, function() {
      chrome.extension.getBackgroundPage().window.location.reload();
      btn.click();
    });
  });

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    updateUrl(currTab);
    window.close();
  });
}

document.addEventListener('DOMContentLoaded', onDomLoaded);
