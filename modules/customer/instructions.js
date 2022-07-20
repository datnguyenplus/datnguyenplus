'use strict'

const path = require('path')

module.exports = async (cli) => {
  try {
    const inFile = path.join(__dirname, './config', 'index.js')
    const outFile = path.join(cli.helpers.configPath(), 'base.js')
    await cli.copy(inFile, outFile)
    cli.command.completed('create', 'config/base.js')
  } catch (error) {
    // ignore error
  }
}