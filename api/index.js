const moduleAlias = require('module-alias')
const path = require('path')

moduleAlias.addAliases({
  '@models': path.resolve(__dirname, '../models'),
  '@routes': path.resolve(__dirname, '../routes'),
  '@controllers': path.resolve(__dirname, '../controllers'),
  '@middlewares': path.resolve(__dirname, '../middlewares'),
  '@lib': path.resolve(__dirname, '../lib'),
  '@root': path.resolve(__dirname, '../')
})

moduleAlias()

module.exports = require('../app')
