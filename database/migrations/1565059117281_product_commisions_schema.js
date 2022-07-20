'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductCommisionsSchema extends Schema {
  up () {
    this.table('product_commisions', (table) => {
      table.string('type').after('value')
    })
  }

  down () {
    this.table('product_commisions', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ProductCommisionsSchema
