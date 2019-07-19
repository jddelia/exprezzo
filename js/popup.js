document.addEventListener('DOMContentLoaded', function() {
  const state = {
    imgData: null
  };
  
  const scanArea = document.getElementById('scanArea');
  const outputArea = document.getElementById('outputArea');
  const img = document.getElementById(imgContainer);

  scanArea.addEventListener('paste', (e) => {
    scanArea.innerText = "";

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
        console.log(state.imgData)

        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          // const activeTab = tabs[0];

          const { TesseractWorker } = Tesseract;
          const worker = new TesseractWorker({
            workerPath: chrome.runtime.getURL('js/worker.min.js'),
            langPath: chrome.runtime.getURL('traineddata'),
            corePath: chrome.runtime.getURL('js/tesseract-core.wasm.js'),
          });
          alert(worker)
          worker.recognize(state.imgData)
            .then(({ text }) => {
              alert(text)
              outputArea.innerText = text;
            })
        });
      };
      reader.readAsDataURL(imgBlob);
    }

    outputArea.removeAttribute('disabled');
  });
}, false);