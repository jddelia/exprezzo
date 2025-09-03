document.addEventListener('DOMContentLoaded', function() {
  const { correctText, segmentLines } = ocrUtils;

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
      const { TesseractWorker } = Tesseract;
        const worker = new TesseractWorker({
          langPath: chrome.runtime.getURL('traineddata'),
        });
      worker.recognize(imgBlob)
        .then(({ data }) => {
          let segmentedText = segmentLines(data);
          if (!spellToggle || spellToggle.checked) {
            segmentedText = correctText(segmentedText);
          }
          outputArea.value = segmentedText;
          scanMessage.innerText = "Completed!";
          scanArea.classList.remove('processing');
        })
        .catch((err) => {
          console.error(err);
          scanArea.classList.remove('processing');
          scanMessage.innerText = 'Failed to process image.';
          outputArea.value = '';
          outputArea.setAttribute('disabled', 'true');
          if (worker.terminate) {
            worker.terminate();
          }
        });
    }

    outputArea.removeAttribute('disabled');
  }

  scanArea.addEventListener('paste', handlePaste);
  // Allow pasting anywhere in the popup
  document.addEventListener('paste', handlePaste);
  // Focus the editable area by default so Ctrl+V works immediately
  scanArea.focus();
}, false);
