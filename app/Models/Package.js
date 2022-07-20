'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Package extends Model {

	static get primaryKey () {
	    return 'id'
	}

	/* static get hidden () {
	    return ['agency_id','promotion_price','point','last_login','promotion_to','promotion_from']
	} */

	static get table () {
	    return 'products'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}


	getId(){
		return this.id;
	}
}

module.exports = Package
