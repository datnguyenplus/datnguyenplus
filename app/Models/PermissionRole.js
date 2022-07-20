'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PermissionRole extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'permission_role'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}
}

module.exports = PermissionRole
