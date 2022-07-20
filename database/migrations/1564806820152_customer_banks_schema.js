'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerBanksSchema extends Schema {
  up () {
    this.create('customer_banks', (table) => {
      table.increments()
      table.integer('customer_id')
      table.string('account_name')
      table.string('account_number')
      table.string('account_address')
      table.string('account_code').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('customer_banks')
  }
}

module.exports = CustomerBanksSchema
