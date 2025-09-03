(function () {
  if (!window.Tesseract) {
    return;
  }

  // Wrap createWorker to force workerPath/corePath under Chrome extension CSP
  if (typeof window.Tesseract.createWorker === 'function') {
    const origCreateWorker = window.Tesseract.createWorker.bind(window.Tesseract);
    window.Tesseract.createWorker = function (options = {}) {
      return origCreateWorker(Object.assign({
        workerPath: chrome.runtime.getURL('js/worker.min.js'),
        corePath: chrome.runtime.getURL('js/tesseract-core.wasm.js'),
      }, options));
    };
  }

  // Wrap legacy TesseractWorker constructor if present
  if (typeof window.Tesseract.TesseractWorker === 'function') {
    const OriginalWorker = window.Tesseract.TesseractWorker;
    window.Tesseract.TesseractWorker = function (options = {}) {
      return new OriginalWorker(Object.assign({
        workerPath: chrome.runtime.getURL('js/worker.min.js'),
        corePath: chrome.runtime.getURL('js/tesseract-core.wasm.js'),
      }, options));
    };
    window.Tesseract.TesseractWorker.prototype = OriginalWorker.prototype;
  }
})();
