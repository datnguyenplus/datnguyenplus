'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductsSchema extends Schema {
  up () {
    this.table('products', (table) => {
      table.dropColumn('promotion_price')
      table.dropColumn('point')
      table.dropColumn('promotion_point')
      table.dropColumn('promotion_from')
      table.dropColumn('promotion_to')
    })
  }

  down () {
    this.table('products', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ProductsSchema
