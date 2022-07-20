'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Permission extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'permissions'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}


	roles () {
	    return this.belongsToMany('App/Models/Role').pivotTable('permission_role')
	}
}

module.exports = Permission
