'use strict'

const PageClip = require('pageclip')
const MockServer = require('./mock-server')
const clientVersion = require('../package.json').version

describe("PageClip.js", function () {
  let server, pageclip
  beforeEach(function () {
    server = new MockServer()
    server.listen()
    pageclip = new PageClip('api_abc123ABC123abc123abc123abc12345', {baseURL: server.getUrl()})
  })

  afterEach(function () {
    server.close()
  })

  describe("token validation", function () {
    it("throws when token is invalid", function () {
      let fn = () => new PageClip('not valid')
      expect(fn).to.throw()
    })
  })

  describe("::fetch()", function () {
    it("returns the data for default bucket when no bucket specified", function () {
      return pageclip.fetch().then((res) => {
        expect(res.status).to.equal(200)
        expect(res.data).to.have.length(2)
        expect(res.bucket).to.equal('default')

        expect(res.req.method).to.equal('GET')
        expect(res.req.headers['authorization']).to.contain('Basic ')
        expect(res.req.headers['user-agent']).to.equal(`pageclip.js v${clientVersion}`)
        expect(res.req.headers['x-reqmethod']).to.equal('api-client')
        expect(res.req.headers['x-reqtransport']).to.equal('api-client')
      })
    })

    it("returns the data for specified bucket", function () {
      return pageclip.fetch('abucket').then((res) => {
        expect(res.status).to.equal(200)
        expect(res.data).to.have.length(2)
        expect(res.bucket).to.equal('abucket')
      })
    })

    it("returns the error when error", function () {
      return pageclip.fetch('fail').then((res) => {
        expect(res.status).to.equal(400)
        expect(res.errors).to.have.length(1)

        expect(res.req.method).to.equal('GET')
        expect(res.req.headers['user-agent']).to.equal(`pageclip.js v${clientVersion}`)
        expect(res.req.headers['x-reqmethod']).to.equal('api-client')
        expect(res.req.headers['x-reqtransport']).to.equal('api-client')
      })
    })
  })

  describe("::send()", function () {
    let data
    it("sends data for default bucket when none specified", function () {
      data = {things: 'stuff'}
      return pageclip.send(data).then((res) => {
        expect(res.status).to.equal(200)
        expect(res.data).to.equal('ok')
        expect(res.bucket).to.equal('default')

        expect(res.req.body).to.eql(data)

        expect(res.req.method).to.equal('PUT')
        expect(res.req.headers['authorization']).to.contain('Basic ')
        expect(res.req.headers['user-agent']).to.equal(`pageclip.js v${clientVersion}`)
        expect(res.req.headers['x-reqmethod']).to.equal('api-client')
        expect(res.req.headers['x-reqtransport']).to.equal('api-client')
      })
    })

    it("sends data to the specified bucket", function () {
      data = {things: 'stuff'}
      return pageclip.send('abucket', data).then((res) => {
        expect(res.status).to.equal(200)
        expect(res.data).to.equal('ok')
        expect(res.bucket).to.equal('abucket')
        expect(res.req.body).to.eql(data)
        expect(res.req.method).to.equal('PUT')
      })
    })

    it("returns status and errors when there are errors", function () {
      data = {things: 'stuff'}
      return pageclip.send('fail', data).then((res) => {
        expect(res.status).to.equal(400)
        expect(res.errors).to.have.length(1)
        expect(res.req.method).to.equal('PUT')
      })
    })
  })
})
