'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCustomerCodeSchema extends Schema {
  up () {
    this.table('customers', (table) => {
      table.string('customer_code').after('remember_token').nullable()
    })
  }

  down () {
    this.table('customers', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddCustomerCodeSchema
