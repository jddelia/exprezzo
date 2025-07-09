document.addEventListener('DOMContentLoaded', function() {
  const { correctText, segmentLines } = ocrUtils;
  const state = {
    imgData: null
  };

  const spellToggle = document.getElementById('spellToggle');
  
  const scanArea = document.getElementById('scanArea');
  const scanMessage = document.getElementById('scanMessage');
  const outputArea = document.getElementById('outputArea');
  // const img = document.getElementById(imgContainer);

    function handlePaste(e) {
      e.preventDefault();
      scanArea.classList.add('processing');
      scanMessage.innerText = "Processing...";

    const items = (e.clipboardData  || e.originalEvent.clipboardData).items;

    let imgBlob = null;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        imgBlob = items[i].getAsFile();
      }
    }
    
    if (imgBlob !== null) {
      var reader = new FileReader();
      reader.onload =  function(event) {
        state.imgData = event.target.result;

        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          // const activeTab = tabs[0];

          const { TesseractWorker } = Tesseract;
          const worker = new TesseractWorker({
            workerPath: chrome.runtime.getURL('js/worker.min.js'),
            langPath: chrome.runtime.getURL('traineddata'),
            corePath: chrome.runtime.getURL('js/tesseract-core.wasm.js'),
          });
          worker.recognize(state.imgData)
            .then(({ data }) => {
              let segmentedText = segmentLines(data);
              if (!spellToggle || spellToggle.checked) {
                segmentedText = correctText(segmentedText);
              }
                outputArea.value = segmentedText;
                scanMessage.innerText = "Completed!";
                scanArea.classList.remove('processing');
            })
        });
      };
      reader.readAsDataURL(imgBlob);
    }

    outputArea.removeAttribute('disabled');
  }

  scanArea.addEventListener('paste', handlePaste);
  // Allow pasting anywhere in the popup
  document.addEventListener('paste', handlePaste);
  // Focus the editable area by default so Ctrl+V works immediately
  scanArea.focus();
}, false);
