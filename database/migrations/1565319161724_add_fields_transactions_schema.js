'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldsTransactionsSchema extends Schema {
  up () {
    this.table('transactions', (table) => {
      table.dropColumn('curency')
      table.dropColumn('tracsaction_id')
      table.integer('dropColumn')
      table.string('curencyUSD').after('txhash')
      table.string('curencyVND').after('txhash')
      table.string('curencyPOINT').after('txhash')
      table.integer('order_id').after('customer_id')
      table.string('tracsaction_code').after('customer_id')
    })
  }

  down () {
    this.table('transactions', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddFieldsTransactionsSchema
