'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Config = use('Config')
class Customer extends Model {

	static get primaryKey () {
	    return 'id'
	}

	static get computed () {
	    return ['full_name' ,'level_name_commissions']
	}

	getFullName ({ first_name, last_name }) {
	    return `${first_name} ${last_name}`
	}

	getLevelNameCommissions ({ level_commissions }) {
		const icarebaseTree = Config.get('app.icarebaseTree')
	    return icarebaseTree[level_commissions]
	}

	static get hidden () {
	    return ['wallet_private_key','password','email_verified_at','last_login','first_login','remember_token']
	}

	static get table () {
	    return 'customers'
	}

	static get createdAtColumn () {
	    return 'created_at'
	}

	static get updatedAtColumn () {
	    return 'updated_at'
	}

	getEmailAttribute(){
		return this.email;
	}

	getFullNameAttribute(){
		return this.first_name + ' ' + this.last_name;
	}

	customer_token() {
	    return this.hasOne('App/Models/CustomerToken','customer_id','id')
	}

	customer_logs() {
	    return this.hasMany('App/Models/CustomerLog','customer_id','id')
	}


	sponsor() {
	    return this.belongsTo('App/Models/Customer','sponsor_id','id').select('id','first_name','last_name','email','sponsor_id')
	}

	childrens() {
	    return this.hasMany('App/Models/Customer','sponsor_id','id')
	}

	levelInfoCommissions(){
		return this.belongsTo('App/Models/Level','level_commissions','level')
			.select('id','level','title','color')
	}
}

module.exports = Customer
