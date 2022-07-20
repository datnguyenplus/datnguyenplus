'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CurrencyExchangesSchema extends Schema {
  up () {
    this.create('currency_exchanges', (table) => {
      table.increments()
      table.string('from_currency')
      table.double('from_currency_value')
      table.string('to_currency')
      table.double('to_currency_value')
      table.timestamps()
    })
  }

  down () {
    this.drop('currency_exchanges')
  }
}

module.exports = CurrencyExchangesSchema
