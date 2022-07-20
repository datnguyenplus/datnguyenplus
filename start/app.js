"use strict";
const path = require("path");
/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  "@adonisjs/framework/providers/AppProvider",
  "@adonisjs/framework/providers/ViewProvider",
  "@adonisjs/lucid/providers/LucidProvider",
  "@adonisjs/bodyparser/providers/BodyParserProvider",
  "@adonisjs/cors/providers/CorsProvider",
  "@adonisjs/shield/providers/ShieldProvider",
  "@adonisjs/session/providers/SessionProvider",
  "@adonisjs/auth/providers/AuthProvider",
  "adonis-swagger/providers/SwaggerProvider",
  "@adonisjs/mail/providers/MailProvider",
  "@adonisjs/validator/providers/ValidatorProvider",
  path.join(__dirname, "../modules/admin/providers/AdminServiceProvider"),
  path.join(__dirname, "../modules/customer/providers/FrontendServiceProvider"),
  path.join(__dirname, "../modules/lab/src/Providers/ProductServiceProvider"),
  path.join(
    __dirname,
    "../modules/docter/src/Providers/ProductServiceProvider"
  ),
  "adonis-queue-pro/providers/QueueProvider",
];

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  "@adonisjs/lucid/providers/MigrationsProvider",
  "adonis-queue-pro/providers/CommandProvider",
];

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {
  Queue: "Adonis/Addons/Queue",
  TemplateId: "App/Libraries/TemplateSendgird",
  SendGird: "App/Libraries/SendGird",
  ModelSendGird: "App/Models/SendGird",
  UsrToken: "App/Models/UserToken",
};

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [
  "Adonis/Commands/Queue:Init",
  "Adonis/Commands/Queue:Job",
  "Adonis/Commands/Queue:Work",
];

module.exports = { providers, aceProviders, aliases, commands };
