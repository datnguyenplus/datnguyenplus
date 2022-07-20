'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CombosSchema extends Schema {
  up () {
    this.create('combos', (table) => {
      table.increments()
      table.string('combo_name')
      table.text('combo_description').nullable()
      table.integer('combo_status')
      table.text('product_of_combo')
      table.timestamps()
    })
  }

  down () {
    this.drop('combos')
  }
}

module.exports = CombosSchema
