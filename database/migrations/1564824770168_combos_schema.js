'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CombosSchema extends Schema {
  up () {
    this.table('combos', (table) => {
      table.double('price').after('product_of_combo')
      table.double('discounts').after('price')
    })
  }

  down () {
    this.table('combos', (table) => {
      // reverse alternations
    })
  }
}

module.exports = CombosSchema
