document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root')

  root.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      
    });
  }, false);
}, false);