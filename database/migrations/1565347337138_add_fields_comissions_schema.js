'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldsComissionsSchema extends Schema {
  up () {
    this.table('commissions', (table) => {
      table.integer('level_commissions').after('level_f')
    })
  }

  down () {
    this.table('commissions', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddFieldsComissionsSchema
