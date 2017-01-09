'use strict'

const path = require('path')
const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')

// Make requires relative to the src directory
const appModulePath = require('app-module-path')
appModulePath.addPath(path.join(__dirname, '..', 'src'))

chai.use(sinonChai)

global.chai = chai
global.sinon = sinon
global.expect = chai.expect
global.should = chai.should()
