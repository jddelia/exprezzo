importScripts('js/tesseract.min.js');

const worker = Tesseract.createWorker({
  workerPath: chrome.runtime.getURL('js/worker.min.js'),
  corePath: chrome.runtime.getURL('js/tesseract-core.wasm.js'),
  langPath: chrome.runtime.getURL('traineddata'),
});

let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    initialized = true;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'recognize' && message.image) {
    (async () => {
      await ensureInitialized();
      const { data } = await worker.recognize(message.image);
      sendResponse({ data });
    })();
    return true; // keep messaging channel open for async response
  }
});
