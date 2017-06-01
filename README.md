# node-pageclip

This is the official node.js API client for [Pageclip](https://pageclip.co).

## Usage

```sh
npm install --save pageclip
```

Basic usage:

```js
const Pageclip = require('pageclip')
let pageclip = new Pageclip(yourAPIKey)

// Send an item up to Pageclip
pageclip.send({some: 'data'}).then((response) => {
  console.log(response.status, response.data) // => 200, [{payload: {...}}]
}).then(() => {
  // Fetch all items
  return pageclip.fetch()
}).then((response) => {
  console.log(response.status, response.data) // => 200, [{payload: {...}}]
})
```

## API

### Pageclip(apiKey)

Create a Pageclip Object.

* `apiKey` (String) - found in the web interface of Pageclip. Note that `apiKey` must be the private API key. Your public siteKey will not work!

```js
const Pageclip = require('pageclip')
let pageclip = new Pageclip('abc123ABC123abc123abc123abc12345')
```

### Pageclip::send([bucketName], data)

Send data to Pageclip.

* `bucketName` (String; _optional_; default: 'default') - bucket to which you want to attach `data`.
* `data` (Object or Array) - data you want to send up. When `Object` it will treat it as a single Item. If `Array`, it will treat each entry as an Item.
* Returns a `Promise` with `Object` payload
  * `status` (Integer) - HTTP status code
  * `bucket` (String) - bucket name
  * `data` (Array of [Items](#items)) - Returns all items that were saved. See [Items](#items)
  * `errors` (Array of Objects) - Will be present if `status >= 400`. See [Errors](#errors)

```js
let pageclip, promise, data
pageclip = new Pageclip('abc123ABC123abc123abc123abc12345')

// Send one item
data = {some: 'data'}
promise = pageclip.send(data).then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'default'
    response.data    // [Item({some: 'data'})]
  )
})

// Send multiple items
data = [{some: 'data'}, {some: 'otherdata'}]
promise = pageclip.send(data).then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'default'
    response.data    // [Item({some: 'data'}), Item({some: 'otherdata'})]
  )
})

// Send one item to a named bucket
data = {email: 'john@omgunicorns.com'}
promise = pageclip.send('mailinglist', data).then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'mailinglist'
    response.data    // [Item({email: 'john@omgunicorns.com'})]
  )
})
```

### Pageclip::fetch([bucketName])

Retrieve your data from Pageclip. At this time, it returns all items in the bucket&mdash;there is no pagination or slicing.

* `bucketName` (String; _optional_; default: 'default') - bucket from which you want to fetch data.
* Returns a `Promise` with `Object` payload
  * `status` (Integer) - HTTP status code
  * `bucket` (String) - bucket name
  * `data` (Array of [Items](#items)) - All Items in the bucket. See [Items](#items)
  * `errors` (Array of Objects) - Will be present if `status >= 400`. See [Errors](#errors)

```js
let pageclip, promise
pageclip = new Pageclip('api_abc123ABC123abc123abc123abc12345')

// Fetch items from the default bucket
promise = pageclip.fetch().then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'default'
    response.data    // [Item]
  )
})

// Fetch items from a named bucket
promise = pageclip.fetch('mailinglist').then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'mailinglist'
    response.data    // [Item, Item]
  )
})
```

### Items

All Item objects returned by the API will have the following shape:

```js
  {
    itemEid: 'abc123ABC123abc123abc123abc12345',
    createdAt: '1983-06-29T14:48:00Z', // ISO date
    payload: {
      // the data from the user
    }
  }
```

### Errors

API errors will return a response with an `errors` key that contains an Array of objects:

```js
  {
    errors: [{
      message: 'Name is required',
      property: 'name' // If the error is associated with a property
    }, ...]
  }
```
