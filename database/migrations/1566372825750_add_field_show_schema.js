'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldShowSchema extends Schema {
  up () {
    this.table('orders', (table) => {
      table.integer('payment_view').default(1).comment('1 Show , 0 not display')
    })
  }

  down () {
    this.table('add_field_shows', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddFieldShowSchema
