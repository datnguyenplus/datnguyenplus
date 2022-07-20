'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Withdraw extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'withdraws'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}

	customer () {
	    return this.belongsTo('App/Models/Customer','customer_id','id')
	    	.select('id','first_name','last_name','email','sponsorKey','sponsor_id','image','level_commissions')
	}
}

module.exports = Withdraw
