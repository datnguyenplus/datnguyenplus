'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class SendGird extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get table () {
	    return 'sendgirds'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}

	static async findSlugTemplate(alias){
		let data = await SendGird.query().where('alias',alias).first();
		return data;
	}
}

module.exports = SendGird
