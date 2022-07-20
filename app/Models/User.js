'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
  }
  static get computed () {
      return ['full_name']
  }

  getFullName ({ first_name, last_name }) {
      return `${first_name} ${last_name}`
  }

  getEmailAttribute(){
    return this.email;
  }

  getFullNameAttribute(){
    return this.first_name + ' ' + this.last_name;
  }

  static get hidden () {
      return ['password']
  }

  static get createdAtColumn () {
      return 'created_at'
  }

  static get updatedAtColumn () {
      return 'updated_at'
  }
  
  tokens () {
    return this.hasMany('App/Models/Token')
  }


  roles () {
    return this.belongsToMany('App/Models/Role').pivotTable('role_user')
  }
}

module.exports = User
