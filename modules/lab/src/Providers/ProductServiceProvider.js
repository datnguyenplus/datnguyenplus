'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const Helpers = use('Helpers')
const edge = require('edge.js')
const path = require('path')

class ProductServiceProvider extends ServiceProvider 
{
	registerRoutes(){
  		this.app.autoload(path.join(__dirname, '../Http/Controllers'), 'Lab');
	}

  	register () {
  		this.registerRoutes()
  	}

  	boot () {
  		require('../Http/routes.js')
  	}
}

module.exports = ProductServiceProvider