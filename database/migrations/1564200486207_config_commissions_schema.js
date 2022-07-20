'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Env = use('Env')

class ConfigCommissionsSchema extends Schema {

	static get connection () {
    	return Env.get('DB_CONNECTION')
  	}
  	
  	up () {
	    this.create('config_commissions', (table) => {
	      	table.increments()
	      	table.string('level_type')
	      	table.integer('value')
	      	table.timestamp('created_at').defaultTo(this.fn.now())
          table.timestamp('updated_at').defaultTo(this.fn.now())
	    })
  	}

  	down () {
  	  this.drop('config_commissions')
  	}
}

module.exports = ConfigCommissionsSchema
