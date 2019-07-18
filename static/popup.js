document.addEventListener('DOMContentLoaded', function() {
  const state = {
    imgData: null
  };
  
  const scanArea = document.getElementById('scanArea');
  const outputArea = document.getElementById('outputArea');

  scanArea.addEventListener('paste', async (e) => {
    scanArea.innerText = "";

    // use event.originalEvent.clipboard for newer chrome versions
    var items = (e.clipboardData  || e.originalEvent.clipboardData).items;
    alert(e.clipboardData)
    alert(JSON.stringify(items)); // will give you the mime types
    // find pasted image among pasted items
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }
    // load image if there is a pasted image
    try {
      if (blob !== null) {
        var reader = new FileReader();
        reader.onload =  await function(event) {
          state.imgData = event.target.result; // data url!
        };
        reader.readAsDataURL(blob);
      }
    } catch(e) {
      alert(e)
    }

    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const activeTab = tabs[0];

      alert(state.imgData)
    });

    outputArea.removeAttribute('disabled');
  });
}, false);