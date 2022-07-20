'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BankAccount extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'customer_banks'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}
}

module.exports = BankAccount
