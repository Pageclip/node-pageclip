# node-datacastle

This is the official node.js API client for DataCastle.

## Usage

```sh
npm install --save datacastle
```

Basic usage:

```js
const DataCastle = require('datacastle')
let datacastle = new DataCastle(yourAPIKey)

// Send an item up to DataCastle
datacastle.send({some: 'data'}).then((response) => {
  console.log(response.status, response.data) // => 200, 'ok'
}).then(() => {
  // Fetch all items
  return datacastle.fetch()
}).then((response) => {
  console.log(response.status, response.data) // => 200, [{some: 'data'}]
})
```

## API

### DataCastle(apiKey)

Create a DataCastle Object.

* `apiKey` (String) - found in the web interface of DataCastle. Note that `apiKey` must be the API specific key. Your public key will not work!

```js
const DataCastle = require('datacastle')
let datacastle = new DataCastle('abc123ABC123abc123abc123abc12345')
```

### DataCastle::send([bucketName], data)

Send data to DataCastle.

* `bucketName` (String; _optional_; default: 'default') - bucket to which you want to attach `data`.
* `data` (Object or Array) - data you want to send up. If `Array`, it will treat each entry as an item.
* Returns a `Promise` with `Object` payload
  * `status` (Integer) - HTTP status code
  * `bucket` (String) - bucket name
  * `data` (String) - 'ok' if success
  * `errors` (Array of Objects) - Will be present if the status code >= 400. e.g. `[{message: 'something went wrong'}]`

```js
let datacastle, promise, data
datacastle = new DataCastle('abc123ABC123abc123abc123abc12345')

// Send one item
data = {some: 'data'}
promise = datacastle.send(data).then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'default'
    response.data    // 'ok'
  )
})

// Send multiple items
data = [{some: 'data'}, some: 'otherdata']
promise = datacastle.send(data).then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'default'
    response.data    // 'ok'
  )
})

// Send one item to a named bucket
data = {email: 'john@omgunicorns.com'}
promise = datacastle.send('mailinglist', data).then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'mailinglist'
    response.data    // 'ok'
  )
})
```

### DataCastle::fetch([bucketName])

Retrieve your data from DataCastle.

* `bucketName` (String; _optional_; default: 'default') - bucket from which you want to fetch data.
* Returns a `Promise` with `Object` payload
  * `status` (Integer) - HTTP status code
  * `bucket` (String) - bucket name
  * `data` (Array of Objects) - e.g. `[{email: 'bob@reynolds.com'}, ...]`
  * `errors` (Array of Objects) - Will be present if the status code >= 400. e.g. `[{message: 'something went wrong'}]`

```js
let datacastle, promise
datacastle = new DataCastle('abc123ABC123abc123abc123abc12345')

// Fetch items from the default bucket
promise = datacastle.fetch().then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'default'
    response.data    // [{some: 'data'}]
  )
})

// Fetch items from a named bucket
promise = datacastle.fetch('mailinglist').then((response) => {
  console.log(
    response.status, // 200
    response.bucket, // 'mailinglist'
    response.data    // [{email: 'john@omgunicorns.com'}, ...]
  )
})
```
