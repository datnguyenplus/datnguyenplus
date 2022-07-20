'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Transaction extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'transactions'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}

	customer () {
	    return this.belongsTo('App/Models/Customer','customer_id','id')
	    	.select('id','first_name','last_name','email','sponsorKey','sponsor_id','image')
	}

	order () {
	    return this.belongsTo('App/Models/Order','order_id','id')
	}
}

module.exports = Transaction
