'use strict'

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Swagger Information
  | Please use Swagger 2 Spesification Docs
  | https://swagger.io/docs/specification/2-0/basic-structure/
  |--------------------------------------------------------------------------
  */

  enable: true,
  specUrl: '/swagger.json',

  options: {
    swaggerDefinition: {
      info: {
        title: 'CMS Swagger',
        version: '1.0.0',
      },
      basePath: '/',

      // Example security definitions.
      securityDefinitions: {
        Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
        },
        // ApiKey: {
        //   description: 'ApiKey description',
        //   name: 'Authorization',
        // },

        // OAuth2 configuration
        /* OAuth2: {
          authorizationUrl: 'https://example.com/oauth/authorize',
          tokenUrl: 'https://example.com/oauth/token',

          // define your scopes here
          // remove read, write and admin if not necessary
          scopes: {
            read: 'Grants read access (this is just sample)',
            write: 'Grants write access (this is just sample)',
            admin: 'Grants read and write access to administrative information (this is just sample)'
          }
        },*/
      }
    },

    // Path to the API docs
    // Sample usage
    // apis: [
    //    'docs/**/*.yml',    // load recursive all .yml file in docs directory
    //    'docs/**/*.js',     // load recursive all .js file in docs directory
    // ]
    apis: [
      'app/**/*.js',
      'app/Definitions/**/*.js',
      'start/routes.js',
      'modules/*/src/controllers/http/*.js',
      'modules/*/definitions/**/*.js',
      'modules/*/src/http/controllers/*.js',
      'modules/*/src/Http/Controllers/*.js'
    ]
  }
}