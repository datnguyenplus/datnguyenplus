'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'roles'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}


	users () {
	    return this.belongsToMany('App/Models/Role').pivotTable('role_user').withTimestamps()
	}


	permissions () {
	    return this.belongsToMany('App/Models/Permission').pivotTable('permission_role').withTimestamps()
	}
}

module.exports = Role
