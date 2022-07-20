'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PromotionsSchema extends Schema {
  up () {
    this.table('promotions', (table) => {
      table.integer('status').after('type_value')
    })
  }

  down () {
    this.table('promotions', (table) => {
      // reverse alternations
    })
  }
}

module.exports = PromotionsSchema
