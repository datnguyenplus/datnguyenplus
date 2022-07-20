'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PackagesSchema extends Schema {
  up () {
    this.table('products', (table) => {
      table.double('price_sale').after('price')
      table.string('image').after('price')
      table.integer('status').after('wasSale')
    })
  }

  down () {
    this.table('products', (table) => {
      // reverse alternations
    })
  }
}

module.exports = PackagesSchema
