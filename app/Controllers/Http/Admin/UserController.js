'use strict'
const Env = use('Env')
const Ethereum = use('App/Libraries/Ethereum')
const Config = use('Config')
const axios = require('axios')
class UserController {
  /**
       * @swagger
       * /api/eth-transferGas:
       *   post:
       *     tags:
       *       - Ethereum
       *     summary: Transfer a Ethereum Gas
       *     description: Transfer a Ethereum Gas
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: transfer
       *         description: Transfer Object
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/TransferGas'
       *     responses:
       *       200:
       *         description: Transfer a transaction
       */
    
    async transferGas ({ request, response }) {
      /**
       * @author DatNguyen
       * @fucntion transfer
       *
       */
      var data = request.all();
      const oj = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      data.oj = oj;
      const  transfer = use('App/Libraries/SendEthereum');
      const result = await transfer.exeTransactionGas(data);
      return response.json({'data' : result});
    }
    /**
       * @swagger
       * /api/eth-transfer:
       *   post:
       *     tags:
       *       - Ethereum
       *     summary: Transfer a Ethereum
       *     description: Transfer a Ethereum
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: transfer
       *         description: User object
       *         in:  body
       *         required: true
       *         type: string
       *         schema:
       *           $ref: '#/definitions/Transfer'
       *     responses:
       *       200:
       *         description: Transfer a transaction
       */
    
    async transfer ({ request, response }) {
      /**
       * @author DatNguyen
       * @fucntion transfer
       *
       */
      var data = request.all();
      const oj = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
      data.oj = oj;
      const  transfer = use('App/Libraries/SendEthereum');
      const result = await transfer.exeTransaction(data);
      return response.json({'data' : result});
    }
    
    /**
      * @swagger
      * /api/eth-hash:
      *   get:
      *     tags:
      *       - Ethereum
      *     summary: Get a Hash Ethereum
      *     parameters:
      *       - name: hash
      *         description: Wallet address Eth
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Send a Ethereum
      */
    async hash ({ request, response }) {
        /**
         * @author DatNguyen
         * @fucntion hash
         *
         */
        var requestData = request.all()
        const {hash} = use('App/Libraries/Ethereum')
        var results = await hash(requestData.hash)
        return response.status(201).json({'data' : results})
    }

    
    
    /**
      * @swagger
      * /api/eth-create:
      *   post:
      *     tags:
      *       - Ethereum
      *     summary: Create New a Wallet Address Ethereum
      *     responses:
      *       200:
      *         description: Send a Ethereum
      */
    async createWallet ({ request, response }) {
        /**
         * @author DatNguyen
         * @fucntion createWallet
         *
         */
        const {createWallet} = use('App/Libraries/Ethereum')
        var results = await createWallet()
        console.log(results)
        return response.status(201).json({status : 'success' , 
            data : {
                address     : results.address ,
                privateKey  : results.privateKey ,
            }
        })
    }

    
    /**
      * @swagger
      * /api/eth-balance:
      *   get:
      *     tags:
      *       - Ethereum
      *     summary: Get Balance From Wallet Address Ethereum
      *     parameters:
      *       - name: address
      *         description: Wallet address Eth
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Send a Ethereum
      */
    async balance ({ request, response }) {
        /**
         * @author DatNguyen
         * @fucntion balance
         *
         */
        var requestData = request.all()
        var Web3 = require('web3');
        var web3 = new Web3(new Web3.providers.HttpProvider(Env.get('INFURA_URL')))
        const {getBalanceAddress} = use('App/Libraries/Ethereum')
        var results = await getBalanceAddress(requestData.address)
        let amount = web3.utils.fromWei(results, "ether")
        return response.status(201).json({status : 'success','data' : amount})
    }

   
    /**
      * @swagger
      * /api/eth-transactions:
      *   get:
      *     tags:
      *       - Ethereum
      *     summary: Get All Transactions From Wallet Address Ethereum
      *     parameters:
      *       - name : address
      *         description: Wallet address Eth
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: Send a Ethereum
      */
    async transactions ({ request, response }) {
         /**
         * @author DatNguyen
         * @fucntion balance
         *
         */
        var requestData = request.all()
        const {transactions} = use('App/Libraries/Ethereum')
        var results = await transactions(requestData.address)
        return response.status(201).json({'status': 'success','data' : results})
    }
}
module.exports = UserController
