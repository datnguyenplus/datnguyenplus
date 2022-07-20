'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldOrdersSchema extends Schema {
  up () {
    this.table('orders', (table) => {
      table.string('type_buy').after('total_commission').comment('combo|package')
    })
  }

  down () {
    this.table('orders', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddFieldOrdersSchema
