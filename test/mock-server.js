'use strict'

const http = require('http')

module.exports = class MockServer {
  constructor () {
    this.port = 18181
    this.server = http.createServer(this.handleRequest.bind(this))
  }

  getUrl () {
    return `http://localhost:${this.port}`
  }

  listen () {
    this.server.listen(this.port)
  }

  close (callback) {
    this.server.close(callback)
  }

  handleRequest (req, res) {
    return Routes[req.method.toLowerCase()][req.url](req, res)
  }
}

let Routes = {
  put: {
    '/api/data/default': function (req, res) {
      putData('default', req, res)
    },
    '/api/data/abucket': function (req, res) {
      putData('abucket', req, res)
    },
    '/api/data/fail': function (req, res) {
      failData('fail', req, res)
    }
  },
  get: {
    '/api/data/default': function (req, res) {
      getData('default', req, res)
    },
    '/api/data/abucket': function (req, res) {
      getData('abucket', req, res)
    },
    '/api/data/fail': function (req, res) {
      failData('fail', req, res)
    }
  }
}

function failData (bucket, req, res) {
  getBody(req).then((body) => {
    let out = {errors: [{message: 'nope'}], req: {
      body,
      bucket,
      method: req.method,
      headers: req.headers
    }}
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(`${JSON.stringify(out)}\n`)
  })
}

function putData (bucket, req, res) {
  getBody(req).then((body) => {
    let out = {data: 'ok', bucket, req: {
      body,
      bucket,
      method: req.method,
      headers: req.headers
    }}
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(`${JSON.stringify(out)}\n`)
  })
}

function getData (bucket, req, res) {
  let items = [
    {thing: 1},
    {thing: 2}
  ]

  getBody(req).then((body) => {
    let out = {data: items, bucket, req: {
      body,
      bucket,
      method: req.method,
      headers: req.headers
    }}
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(`${JSON.stringify(out)}\n`)
  })
}

function getBody (req) {
  return new Promise(function (resolve) {
    let body = []
    req
      .on('data', (chunk) => body.push(chunk))
      .on('end', () => {
        body = Buffer.concat(body).toString().trim()
        body = body ? JSON.parse(body) : null
        resolve(body)
      })
  })
}
