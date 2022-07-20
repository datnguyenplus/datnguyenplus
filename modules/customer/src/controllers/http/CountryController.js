'use strict'

const Env = use('Env')
const LocationWorld = use('App/Libraries/LocationWorld')
const VietnamCity = use('App/Models/VietnamCity')
const MessageCode = use('App/Libraries/MessageCode')
const Database = use('Database')
class CountryController{

      /**
      * @swagger
      * /api/v1/countries:
      *   get:
      *     tags:
      *       - Countries
      *     summary: Countries
      *     responses:
      *       200:
      *         description: Countries
      */
      async countries ({request, response }) {
            var countries = LocationWorld.getAllCountries()
            return response.respondWithSuccess(countries,'List All Countries Successfull!')
      }


      /**
      * @swagger
      * /api/v1/cities:
      *   get:
      *     tags:
      *       - Countries
      *     summary: Cities
      *     parameters:
      *       - name: city_name
      *         description: City Name
      *         in: query
      *         required: true
      *         type: string
      *     responses:
      *       200:
      *         description: City Name
      */
      async cities ({request, response }) {
            var data = request.all()
            var cities;
            cities = LocationWorld.getCities(data.city_name)
            if (data.city_name == 'Vietnam') {
                  cities = await VietnamCity.all()
            }
            return response.respondWithSuccess(cities,'List All Cities Successfull!')
      }

      
}
module.exports = CountryController
