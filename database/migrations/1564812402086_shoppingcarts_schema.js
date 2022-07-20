'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShoppingcartsSchema extends Schema {
  up () {
    this.create('shoppingcarts', (table) => {
      table.increments()
      table.integer('customer_id')
      table.string('os_device').nullable()
      table.string('ip_address').nullable()
      table.double('price')
      table.integer('quantity')
      table.double('total')
      table.timestamps()
    })
  }

  down () {
    this.drop('shoppingcarts')
  }
}

module.exports = ShoppingcartsSchema
