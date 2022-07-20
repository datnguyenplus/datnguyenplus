'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieddCodeWithdrawsSchema extends Schema {
  up () {
    this.table('withdraws', (table) => {
      table.string('code').after('id')
    })
  }

  down () {
    this.table('add_fiedd_code_withdraws', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddFieddCodeWithdrawsSchema
