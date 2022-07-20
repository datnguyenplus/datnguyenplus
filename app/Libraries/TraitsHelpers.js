'use strict'

const Env = use('Env')
const Config = use('Config')
const axios = require('axios')
const CustomerToken = use('App/Models/CustomerToken')
const Customer = use('App/Models/Customer')
/**
 * @author DatNguyen
 * @fucntion getCurrentCustomer
 *
 */
const getCurrentCustomer = async (bearer) => {
    bearer = bearer.replace("Bearer", "")
    const customerToken = await CustomerToken.query().where('access_token',bearer).first()
    if (customerToken) {
        const customer = await Customer.query()
            .with('levelInfoCommissions')
            .with('sponsor')
            .where('id',customerToken.customer_id)
            .first()
        return customer
    }
    return null
}

/**
 * @author DatNguyen
 * @fucntion getChildCustomerTree
 *
 */
function getChildCustomerTree(arrayData , customer) {
    var map = {}, node, roots = [], i;
    for (i = 0; i < arrayData.length; i += 1) {
        map[arrayData[i].id] = i;
        arrayData[i].children = [];
    }
    for (i = 0; i < arrayData.length; i += 1) {
        node = arrayData[i];
        if (node.sponsor_id == customer.sponsor_id || node.sponsor_id == 0) {
	        if (arrayData[i].id == customer.id) {
	        	roots.push(node);
	        }
        } else {
            arrayData[map[node.sponsor_id]].children.push(node);
        }
    }
    return roots;
}
/**
 * @String Find Level Down
 * @author DatNguyen
 * @fucntion showLevelTypeFCustomer
 *
 */
function showLevelTypeFCustomer(arrayData = [], sponsorId = 0 , level = 0, data = []){
    arrayData.forEach(function(value , key) {
        if (value.id == sponsorId) {
            value.level = level
            showLevelTypeFCustomer(arrayData , value.sponsor_id , level + 1 , data)
            if (level > 0) {
                data.push(value)
            }
        }
    })
    return data;
}
/**
 * @String Find Level Up Children
 * @author DatNguyen
 * @fucntion showLevelTypeFCustomer
 *
 */
function showTreeChildrenCustomer(arrayData = [], sponsorId = 0 , level = 1, data = []){
    arrayData.forEach(function(value , key) {
        if (value.sponsor_id == sponsorId) {
            value.level = level
            showTreeChildrenCustomer(arrayData , value.id , level + 1 , data)
            if (level <= 10) {
                data.push(value)
            }
        }
    })
    return data;
}

module.exports = { 
    getCurrentCustomer ,
    getChildCustomerTree , 
    showLevelTypeFCustomer , 
    showTreeChildrenCustomer
}