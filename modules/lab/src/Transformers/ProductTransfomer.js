'use strict'

const collect = require('collect.js');
const Env = use('Env');

module.exports = {
  transform (product) {
    return {
      'id' 			: product.id,
      'name'		: product.title,
      'code'		: product.package_code,
      'image'		: (product.image != null) ? Env.get('APP_URL') + product.image : null,
      'category'	: product.category,
      'price_sale'	: product.price_sale,
      'description'	: product.description,
      'content'		: product.content,
      'status'		: product.status,
      'created_at' 	: product.created_at,
      'updated_at' 	: product.updated_at,
    };
  },
  transformCollection(products) {
    var data = [];
    for (var i = 0; i < products.length; i++) {
        data.push(this.transform(products[i]));
    }
    return data;
  }
};