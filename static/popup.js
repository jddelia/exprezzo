document.addEventListener('DOMContentLoaded', function() {
  const scanBtn = document.getElementById('scanBtn');
  const outputArea = document.getElementById('outputArea');

  scanBtn.addEventListener('click', (e) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const activeTab = tabs[0];

      outputArea.onpaste = function (event) {
        // use event.originalEvent.clipboard for newer chrome versions
        var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
        console.log(JSON.stringify(items)); // will give you the mime types
        // find pasted image among pasted items
        var blob = null;
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") === 0) {
            blob = items[i].getAsFile();
          }
        }
        // load image if there is a pasted image
        if (blob !== null) {
          var reader = new FileReader();
          reader.onload = function(event) {
            console.log(event.target.result); // data url!
          };
          reader.readAsDataURL(blob);
        }
      }
      outputArea.removeAttribute('disabled');
    });
  });
}, false);