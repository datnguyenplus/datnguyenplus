'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateDataHookAlepaysSchema extends Schema {
  up () {
    this.create('data_hook_alepays', (table) => {
      table.increments()
      table.integer('customer_id').nullable()
      table.text('objects').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('create_data_hook_alepays')
  }
}

module.exports = CreateDataHookAlepaysSchema
