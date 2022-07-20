'use strict'

/*
|--------------------------------------------------------------------------
| ConfigCommissionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const ConfigCommissions = use('App/Models/ConfigCommissions')

class ConfigCommissionSeeder {
  	async run () {
  		var objs = [
  			{
  		  		id : 1,
  		  		level_type : 'F1',
  		  		value : 15		
  		 	},
  		 	{
  		  		id : 2,
  		  		level_type : 'F2',
  		  		value : 10	
  		 	},
  		 	{
  		  		id : 3,
  		  		level_type : 'F3',
  		  		value : 9		
  		 	},
  		 	{
  		  		id : 4,
  		  		level_type : 'F4',
  		  		value : 8		
  		 	},
  		 	{
  		  		id : 5,
  		  		level_type : 'F5',
  		  		value : 7		
  		 	},
  		 	{
  		  		id : 6,
  		  		level_type : 'F6',
  		  		value : 6	
  		 	},
  		 	{
  		  		id : 7,
  		  		level_type : 'F7',
  		  		value : 5		
  		 	},
  		 	{
  		  		id : 8,
  		  		level_type : 'F8',
  		  		value : 1		
  		 	},
  		 	{
  		  		id : 9,
  		  		level_type : 'F9',
  		  		value : 1		
  		 	},
  		 	{
  		  		id : 10,
  		  		level_type : 'F10',
  		  		value : 1		
  		 	}
  		]
  		for (var i = 0; i < objs.length; i++) {
  			const config = new ConfigCommissions()
  			config.id = objs[i].id
  			config.level_type = objs[i].level_type
  			config.value = objs[i].value
  			await config.save()
  		}
  	}
}

module.exports = ConfigCommissionSeeder
