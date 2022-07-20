'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'products'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}

	category() {
	    return this.belongsTo('App/Models/PackageCategory','package_category_id','id')
	    	.select('id','title','code','description','created_at','updated_at')
	}
}

module.exports = Product
