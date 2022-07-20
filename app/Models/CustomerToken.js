'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CustomerToken extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'customer_tokens'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}

	customer () {
	    return this.belongsTo('App/Models/Customer','customer_id','id')
	}
}

module.exports = CustomerToken
