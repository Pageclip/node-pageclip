'use strict'

const Pageclip = require('../index.js')

describe("index.js", function () {
  describe("requiring", function () {
    it("properly exports the module", function () {
      let pageclip = new Pageclip('api_abc123ABC123abc123abc123abc12345')
      expect(pageclip).to.be.ok
    })
  })
})
