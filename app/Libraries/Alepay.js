const axios = require('axios')
const Env = use('Env')
module.exports = {
	createTransaction: function(object) {
		return new Promise((resolve, reject) => {
			const url = Env.get('CUSTOMER_LINK_ALEPAY_URL')
		    axios({
		        method: 'POST',
		        url: url,
		        data : object
		    })
	      	.then(res => {
	      		resolve({
					data : res.data
				})
	      	})
	      	.catch(error => {
				resolve({
					error : error
				})
			})
		})
	},
	exeTransaction: async function(data) {
		let exe_trans = await this.createTransaction(data);
		return exe_trans;
	}
}