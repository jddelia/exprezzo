# exprezzo
Chrome Extension

## Requirements

Make sure you have **Node.js** and **npm** installed on your system. You can verify
their presence by running `node --version` and `npm --version`.

## Install dependencies

Run the following command in the project directory to install all required
packages:

```bash
npm install
```

## Run tests

After installing dependencies you can execute the test suite with:

```bash
npm test
```

The project uses **jest** for its tests.

## Updating Tesseract.js

The files `js/tesseract.min.js`, `js/worker.min.js`, and `js/tesseract-core.wasm.js` are vendored
from the official [Tesseract.js](https://github.com/naptha/tesseract.js) releases. When upgrading,
download fresh copies from upstream rather than editing the minified output directly. Any local
customisation, such as the worker and core paths required for the Chrome extension, should be done
via wrapper scripts like `js/tesseract-wrapper.js` instead of modifying the vendor files.
