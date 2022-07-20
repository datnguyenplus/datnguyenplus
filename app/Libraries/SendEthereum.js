const Web3 = require('web3');
const axios = require('axios');
const Env = use('Env');
const Tx = require('ethereumjs-tx').Transaction;
module.exports = {
	createTransaction: function(data) {
		return new Promise((resolve, reject) => {
			var web3 = new Web3(new Web3.providers.HttpProvider(Env.get('INFURA_URL')));
		    const gasPrices = {
		        low: data.oj.data.safeLow / 10,
		        medium: data.oj.data.average / 10,
		        high: data.oj.data.fast / 10
		    };
		    /* GET BALANCE */
		    const gas = 22000;
		    const gasPrice = gasPrices.low * 1000000000;
		    const value = web3.utils.toWei(String(data.amount), 'ether');
		    const valueSend = value - (gasPrice * gas);
			web3.eth.getTransactionCount(data.from).then(txCount => {
				var txData = {
					"from": data.from,
			        "to": data.to,
			        "value": web3.utils.toHex(valueSend),
			        "gas": web3.utils.toHex(gas),
			        "gasPrice": gasPrice,
			        "nonce": web3.utils.toHex(txCount),
			        "chainId": 2,
				};
				var privateKey = new Buffer(data.privateKey, 'hex');
				var trans = new Tx(txData);
				trans.sign(privateKey);
				var serializedTx = trans.serialize().toString('hex');
				web3.eth.sendSignedTransaction('0x' + serializedTx, function(err, result) {
					if (err) {
						resolve({
							errors: err.message
						});
					} else {
						resolve({
							transactionId: result
						});
					}		
				});
			}).catch(error => {
				resolve({
					errors: error.message
				});
			});
		});
	},
	exeTransaction: async function(transaction_ref) {
		let exe_trans = await this.createTransaction(transaction_ref);
		return exe_trans;
	},
	createTransactionGas: function(data) {
		return new Promise((resolve, reject) => {
			var web3 = new Web3(new Web3.providers.HttpProvider(Env.get('INFURA_URL')));
		    const gasPrices = {
		        low: data.oj.data.safeLow / 10,
		        medium: data.oj.data.average / 10,
		        high: data.oj.data.fast / 10
		    };
		    /* GET BALANCE */
		    const gas = data.gas;
		    const gasPrice = gasPrices.low * 1000000000;
		    const value = web3.utils.toWei(String(data.amount), 'ether');
			web3.eth.getTransactionCount(data.from).then(txCount => {
				var txData = {
					"from": data.from,
			        "to": data.to,
			        "value": web3.utils.toHex(value),
			        "gas": web3.utils.toHex(gas),
			        "gasPrice": gasPrice,
			        "nonce": web3.utils.toHex(txCount),
			        "chainId": 2,
				};
				var privateKey = new Buffer(data.privateKey, 'hex');
				var trans = new Tx(txData);
				trans.sign(privateKey);
				var serializedTx = trans.serialize().toString('hex');
				web3.eth.sendSignedTransaction('0x' + serializedTx, function(err, result) {
					if (err) {
						resolve({
							errors: err.message
						});
					} else {
						resolve({
							transactionId: result
						});
					}		
				});
			}).catch(error => {
				resolve({
					errors: error.message
				});
			});
		});
	},
	exeTransactionGas: async function(transaction_ref) {
		let exe_trans = await this.createTransactionGas(transaction_ref);
		return exe_trans;
	}
}