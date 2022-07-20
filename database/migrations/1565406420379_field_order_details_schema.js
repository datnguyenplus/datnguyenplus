'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FieldOrderDetailsSchema extends Schema {
  up () {
    this.table('order_details', (table) => {
      table.string('name').nullable()
    })
  }

  down () {
    this.table('order_details', (table) => {
      // reverse alternations
    })
  }
}

module.exports = FieldOrderDetailsSchema
