'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Commission extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'commissions'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}

	from_customer () {
	    return this.belongsTo('App/Models/Customer','from_customer_id','id')
	    	.select('id','first_name','last_name','email','sponsorKey','sponsor_id','image','level_commissions','customer_code')
	}

	to_customer () {
	    return this.belongsTo('App/Models/Customer','to_customer_id','id')
	    	.select('id','first_name','last_name','email','sponsorKey','sponsor_id','image','level_commissions','customer_code')
	}

	package () {
		if (this.type == 'package') {
			return this.belongsTo('App/Models/Package','product_id','id')
		}
	    return this.belongsTo('App/Models/Combo','product_id','id')
	}
}

module.exports = Commission
