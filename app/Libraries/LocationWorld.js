'use strict'

const Env = use('Env')

class LocationWorld{
	
    static getAllCountries(){
    	var countries = require ('full-countries-cities').getCountryNames();
        var array = new Array();
        for (var i = 0; i < countries.length ; i++) {
            var object = {'name' : countries[i]}
            array[i] = object;
        }
        return array
    }

    static getCities(country_name){
    	var cities;
    	cities = require ('full-countries-cities').getCities(country_name);
        if (cities != null) {
            if (country_name != 'Vietnam') {
                var array = new Array();
                for (var i = 0; i < cities.length ; i++) {
                    var object = {'name' : cities[i]}
                    array[i] = object;
                }
                return array
            }
        }
    	
    	return cities;
    }
}
module.exports = LocationWorld
