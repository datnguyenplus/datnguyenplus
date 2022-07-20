'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderDetail extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'order_details'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}

	order () {
	    return this.belongsTo('App/Models/Order','order_id','id')
	}

	package () {
	    return this.belongsTo('App/Models/Package','product_id','id')
	}


	combo () {
	    return this.belongsTo('App/Models/Combo','product_id','id')
	}
}

module.exports = OrderDetail
