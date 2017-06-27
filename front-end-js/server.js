'use strict'

const Hapi = require('hapi')
  // const Request = require('request')
const Vision = require('vision')
const Handlebars = require('handlebars')

const Inert = require('inert')

// const LodashFilter = require('lodash.filter')
// const LodashTake = require('lodash.take')
const routes = require('./routes')

const server = new Hapi.Server()

server.connection({
  // host: 'localhost',
  port: 3010
})

// Register vision for our views
server.register(Vision, (err) => {
  if (err) {
    throw err
  }

  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: './views'
  })
})

server.route(routes)

// public content routes

server.register(Inert, () => {})
server.route({
	method: 'GET',
	path: '/public/{param*}',
	handler: {
		directory:{
			path: './public'
		}
	}

})

// end public routes


Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context)
})

Handlebars.registerHelper('ifResult', function(v1, options){
  if (v1){
    return options.fn(this)
  }
})


server.start((err) => {
  if (err) {
    throw err
  }

  console.log(`Server running at: ${server.info.uri}`)
})
