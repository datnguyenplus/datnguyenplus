'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SendgirdsSchema extends Schema {
  up () {
    this.create('sendgirds', (table) => {
      table.increments()
      table.string('alias')
      table.string('to_email')
      table.string('template_id')
      table.text('drawData')
      table.timestamps()
    })
  }

  down () {
    this.drop('sendgirds')
  }
}

module.exports = SendgirdsSchema
