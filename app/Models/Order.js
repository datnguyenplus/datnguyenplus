'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
	//COMPLETED	: 1, //completed
    //PENDDING	: 2, //pending
    //FAILED		: 0, // canceled
	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'orders'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}

	customer () {
	    return this.belongsTo('App/Models/Customer','customer_id','id')
	    	.select('id','first_name','last_name','email','sponsorKey','sponsor_id','image','level_commissions','customer_code')
	}

	detailOrders () {
	    return this.hasMany('App/Models/OrderDetail','id','order_id').orderBy('id','DESC')
	}
}

module.exports = Order

