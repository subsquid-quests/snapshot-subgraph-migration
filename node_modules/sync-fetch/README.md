# sync-fetch
Synchronous wrapper around the Fetch API. Uses [`node-fetch`](https://github.com/bitinn/node-fetch) under the hood, and for some input-parsing code and test cases too.

[![npm](https://img.shields.io/npm/v/sync-fetch?style=flat-square)](https://npmjs.com/package/sync-fetch)

## Install

    npm install sync-fetch

In the browser, a browserify bundle can be loaded from CDNs like unpkg.com.

    <script src="https://unpkg.com/sync-fetch"></script>
    <script src="https://unpkg.com/sync-fetch@VERSION"></script>

## Use

```js
const fetch = require('sync-fetch')

const metadata = fetch('https://doi.org/10.7717/peerj-cs.214', {
  headers: {
    Accept: 'application/vnd.citationstyles.csl+json'
  }
}).json()
// json(), arrayBuffer(), text() and buffer() supported
```

## Limitations

### Node.js

  - Does not support `Stream`s (or `FormData`) as input bodies since they cannot be read or serialized synchronously
  - Does not support `Blob`s as input bodies since they're too complex
  - Does not support the non-spec `agent` option as its value cannot be serialized

### Browser

  - Does not support most options, since `XMLHttpRequest` is pretty limited. Supported are:
    - `method`
    - `body`
    - `headers`
    - `credentials` (but not `omit`)
    - (Non-spec) `timeout`
  - The non-standard `buffer()` method is not supported
  - CORS limitations apply, of course (note they may be stricter for synchronous requests)
