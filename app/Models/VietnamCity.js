'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class VietnamCity extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'vietnam_cities'
	}

	static get visible () {
    return ['name']
  }
}

module.exports = VietnamCity
