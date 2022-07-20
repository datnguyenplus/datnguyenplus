'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Level extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get hidden () {
	    return []
	}

	static get table () {
	    return 'levels'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}
}

module.exports = Level
