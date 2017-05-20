# node-pageclip

This is the official node.js API client for PageClip.

## Usage

```sh
npm install --save pageclip
```

Basic usage:

```js
const PageClip = require('pageclip')
let pageclip = new PageClip(yourAPIKey)

// Send an item up to PageClip
pageclip.send({some: 'data'}).then((response) => {
  console.log(response.status, response.data) // => 200, {items: ['def456...']}
}).then(() => {
  // Fetch all items
  return pageclip.fetch()
}).then((response) => {
  console.log(response.status, response.data) // => 200, [{some: 'data'}]
})
```

## API

### PageClip(apiKey)

Create a PageClip Object.

* `apiKey` (String) - found in the web interface of PageClip. Note that `apiKey` must be the API specific key. Your public key will not work!

```js
const PageClip = require('pageclip')
let pageclip = new PageClip('abc123ABC123abc123abc123abc12345')
```

### PageClip::send([bucketName], data)

Send data to PageClip.

* `bucketName` (String; _optional_; default: 'default') - bucket to which you want to attach `data`.
* `data` (Object or Array) - data you want to send up. If `Array`, it will treat each entry as an item.
* Returns a `Promise` with `Object` payload
  * `status` (Integer) - HTTP status code
  * `bucket` (String) - bucket name
  * `data` (String) - 'ok' if success
  * `errors` (Array of Objects) - Will be present if the status code >= 400. e.g. `[{message: 'something went wrong'}]`

```js
let pageclip, promise, data
pageclip = new PageClip('abc123ABC123abc123abc123abc12345')

// Send one item
data = {some: 'data'}
promise = pageclip.send(data).then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'default'
    response.data    // {items: ['def456...']}
  )
})

// Send multiple items
data = [{some: 'data'}, {some: 'otherdata'}]
promise = pageclip.send(data).then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'default'
    response.data    // {items: ['def456...', 'hij789...']}
  )
})

// Send one item to a named bucket
data = {email: 'john@omgunicorns.com'}
promise = pageclip.send('mailinglist', data).then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'mailinglist'
    response.data    // {items: ['def456...']}
  )
})
```

### PageClip::fetch([bucketName])

Retrieve your data from PageClip.

* `bucketName` (String; _optional_; default: 'default') - bucket from which you want to fetch data.
* Returns a `Promise` with `Object` payload
  * `status` (Integer) - HTTP status code
  * `bucket` (String) - bucket name
  * `data` (Array of Objects) - e.g. `[{email: 'bob@reynolds.com'}, ...]`
  * `errors` (Array of Objects) - Will be present if the status code >= 400. e.g. `[{message: 'something went wrong'}]`

```js
let pageclip, promise
pageclip = new PageClip('abc123ABC123abc123abc123abc12345')

// Fetch items from the default bucket
promise = pageclip.fetch().then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'default'
    response.data    // [{id: 'def456...', some: 'data'}]
  )
})

// Fetch items from a named bucket
promise = pageclip.fetch('mailinglist').then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'mailinglist'
    response.data    // [{id: 'def456...', email: 'john@omgunicorns.com'}, ...]
  )
})
```
