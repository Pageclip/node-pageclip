'use strict'

const DataCastle = require('../index.js')

describe("index.js", function () {
  describe("requiring", function () {
    it("properly exports the module", function () {
      let datacastle = new DataCastle('abc123ABC123abc123abc123abc12345')
      expect(datacastle).to.be.ok
    })
  })
})
