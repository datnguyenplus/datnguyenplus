'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShoppingcartsSchema extends Schema {
  up () {
    this.table('shoppingcarts', (table) => {
      table.string('product_id').after('customer_id')
    })
  }

  down () {
    this.table('shoppingcarts', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ShoppingcartsSchema
