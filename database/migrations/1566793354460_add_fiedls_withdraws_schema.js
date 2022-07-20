'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFiedlsWithdrawsSchema extends Schema {
  up () {
    this.table('withdraws', (table) => {
      table.string('account_name').nullable()
      table.string('account_number').nullable()
      table.string('account_code').nullable()
      table.string('account_address').nullable().comment('branch account')
      table.timestamp('date_completed').nullable()
      table.string('file_transaction').nullable()
      table.string('status').comment('completed|pending|failed')
    })
  }

  down () {
    this.table('withdraws', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddFiedlsWithdrawsSchema
