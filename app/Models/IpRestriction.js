'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class IpRestriction extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'ip_restrictions'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}
}

module.exports = IpRestriction
