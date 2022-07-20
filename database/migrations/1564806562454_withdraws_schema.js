'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WithdrawsSchema extends Schema {
  up () {
    this.create('withdraws', (table) => {
      table.increments()
      table.integer('customer_id')
      table.double('amount')
      table.text('note').nullable()
      table.string('payment_withdraw').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('withdraws')
  }
}

module.exports = WithdrawsSchema
