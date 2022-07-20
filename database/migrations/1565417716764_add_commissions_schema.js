'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCommissionsSchema extends Schema {
  up () {
    this.table('commissions', (table) => {
      table.string('type').after('status')
    })
  }

  down () {
    this.table('add_commissions', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddCommissionsSchema
