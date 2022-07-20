'use strict'

const User = use('App/Models/User')

class AuthController {
	index ({ view}) {
		async index ({ view}) {
			const User = use('App/Models/User')
			const users = await User.all()
		    return view.render('admin.auth.login',{users : users.toJSON()})
		}
	}
}
module.exports = AuthController
