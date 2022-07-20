'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LevelsSchema extends Schema {
  up () {
    this.create('levels', (table) => {
      table.increments()
      table.integer('level')
      table.string('title')
      table.string('color')
      table.timestamps()
    })
  }

  down () {
    this.drop('levels')
  }
}

module.exports = LevelsSchema
