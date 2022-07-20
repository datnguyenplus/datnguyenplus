'use strict'

const Env = use('Env')
const Config = use('Config')
const axios = require('axios')
const CustomerToken = use('App/Models/CustomerToken')
const Customer = use('App/Models/Customer')
/**
 * @author DatNguyen
 * @fucntion balance
 *
 */
const getBalanceAddress = async (address) => {
    var objects = {
         address : address
    }
    var Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider(Env.get('INFURA_URL')));
    const receipt   = web3.eth.getBalance(objects.address.trim())
    return receipt
}

  /**
 * @author DatNguyen
 * @fucntion createWallet
 *
 */
const createWallet = async () => {
    var Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider(Env.get('INFURA_URL')));
    var accountSend = web3.eth.accounts.create();
    return {
        address     : accountSend.address,
        privateKey  : accountSend.privateKey ,
    }
}


/**
 * @author DatNguyen
 * @fucntion hash
 *
 */
const hash = async (TxnHash) => {
    var objects = {
         hash : TxnHash
    }
    var Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider(Env.get('INFURA_URL')));
    const receipt = await web3.eth.getTransaction(objects.hash.trim());
    if (receipt !== null) {
        receipt.value =  web3.utils.fromWei(receipt.value, 'ether');
    }
    return receipt
}


/**
 * @author DatNguyen
 * @fucntion transactions
 *
 */
const transactions = async (address) => {
    var Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider(Env.get('INFURA_URL')));
    const url = "http://api.etherscan.io/api?module=account&action=txlist&address="+address.trim()+"&startblock=0&endblock=99999999&sort=desc&apikey=51NMKTGN1Z4ZUXW8VIET71IKIQYIB6YCG7";
    const { curly } = require('node-libcurl');
    const { statusCode, data, headers } = await curly.get(url)
    const dataObjects = JSON.parse(data)
    var obj = []
    for(var i = 0; i < dataObjects.result.length; i++){
       dataObjects.result[i].value = web3.utils.fromWei(dataObjects.result[i].value, 'ether')
       obj[i] = dataObjects.result[i]
    }
    return obj
}


/**
 * @author DatNguyen
 * @fucntion transfer
 *
 */

const transfers = async (data) => {
    /* START WEB3JS*/
    var Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider(Env.get('INFURA_URL')))
    const oj = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    const gasPrices = {
        low: oj.data.safeLow / 10,
        medium: oj.data.average / 10,
        high: oj.data.fast / 10
    }
    /* GET BALANCE */
    const nonce = await web3.eth.getTransactionCount(data.from)
    const amount = web3.utils.toWei(String(data.amount), "ether")
    /* SEND TRABSACTION */
    var Tx = require('ethereumjs-tx').Transaction;
    const toAddress       = data.to
    const privateKey      = Buffer.from(data.privateKey,'hex')
    const gas = 21000
    const gasPrice = gasPrices.low * 1000000000
    const value = web3.utils.toWei(String(data.amount), 'ether')
    const valueSend = value - (gasPrice * gas)
    const rawTransaction = {
        'from': data.from,
        "to": toAddress,
        "value": web3.utils.toHex(valueSend),
        "gas": gas,
        "gasPrice": gasPrice,
        "nonce": web3.utils.toHex(nonce),
        "chainId": 1,
    }
    // const transaction = new Tx(rawTransaction)
    // transaction.sign(privateKey)
    // const serializedTransaction = transaction.serialize()
    // const results = web3.eth.sendSignedTransaction('0x'+serializedTransaction.toString('hex'))
    // const resultTo = await web3.eth.getTransactionCount(data.to, "pending")
    const senderAccount = await web3.eth.accounts.privateKeyToAccount(data.privateKey)
    const tx = await senderAccount.signTransaction(rawTransaction)
    const results = await web3.eth.sendSignedTransaction(tx.rawTransaction)
    results.on('transactionHash',console.log).on('receipt', console.log)
    return tx
}

module.exports = {
    getBalanceAddress,
    createWallet,
    hash,
    transactions,
    transfers
}
