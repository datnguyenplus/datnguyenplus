'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PromotionsSchema extends Schema {
  up () {
    this.create('promotions', (table) => {
      table.increments()
      table.string('title')
      table.string('code')
      table.timestamp('start_date').nullable()
      table.timestamp('end_date').nullable()
      table.string('type').comment('product|combo')
      table.double('value')
      table.string('type_value').comment('price|percent')
      table.text('description').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('promotions')
  }
}

module.exports = PromotionsSchema
