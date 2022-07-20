'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IcbNewsSchema extends Schema {
  up () {
    this.create('icb_news', (table) => {
      table.increments()
      table.string('title')
      table.string('slug')
      table.string('image').nullable()
      table.integer('status').comment('1 display , 2 hidden')
      table.text('intro').nullable()
      table.longText('content').nullable()
      table.integer('level_id').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('icb_news')
  }
}

module.exports = IcbNewsSchema
