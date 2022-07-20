'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CustomerLog extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'customer_logs'
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

module.exports = CustomerLog
