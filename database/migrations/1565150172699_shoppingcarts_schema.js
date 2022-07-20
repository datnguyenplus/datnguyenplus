'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShoppingcartsSchema extends Schema {
  up () {
    this.table('shoppingcarts', (table) => {
      table.string('last_name').nullable()
      table.string('first_name').nullable()
      table.string('phone_number').nullable()
      table.string('email').nullable()
      table.string('gender').nullable().comment('male|female')
      table.string('address').nullable()
      table.string('province').nullable()
      table.string('country').nullable()
      table.string('age').nullable()
      table.string('company').nullable()
    })

    this.table('order_details', (table) => {
      table.string('last_name').nullable()
      table.string('first_name').nullable()
      table.string('phone_number').nullable()
      table.string('email').nullable()
      table.string('gender').nullable().comment('male|female')
      table.string('address').nullable()
      table.string('province').nullable()
      table.string('country').nullable()
      table.string('age').nullable()
      table.string('company').nullable()
    })
  }

  down () {
    this.table('shoppingcarts', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ShoppingcartsSchema
