const Request = require('request')
const LodashFilter = require('lodash.filter')
const LodashTake = require('lodash.take')
const Boom = require('boom')
const Wreck = require('wreck')

// boom error handler if not exist errors, return REPLY
var statusCodeBad = function (url, reply, view) {
  Request.get(url, function (error, response, body) {
    if (error) {
      throw error
    }

    if (response.statusCode >= 400) {
      reply(Boom.notFound('Boom: Todo not found.'))
    }

    const data = JSON.parse(body)
    reply.view(view, { result: data })
  })
}

module.exports = [

  // INDEX WITHOUT DATA
  // {
  //   method: 'GET',
  //   path: '/',
  //   handler: function (req, reply) {
  //     reply.view('index')
  //   }
  // },

  // INDEX WITH DATA
  {
    method: 'GET',
    path: '/',
    handler: function (req, reply) {
      // reply.view('index')

      var url = 'http://mint:3000/todos'
      statusCodeBad(url, reply, 'index')
    }
  },

  {
    method: 'GET',
    path: '/index',
    handler: function (req, reply) {
      // reply.view('index')

      var url = 'http://mint:3000/todos'
      statusCodeBad(url, reply, 'index')
    }
  },

  // LIST ALL
  {
    method: 'GET',
    path: '/listall',
    handler: function (req, reply) {
      var url = 'http://mint:3000/todos'

      statusCodeBad(url, reply, 'listall')
        // Request.get('http://mint:3000/todos', function (error, response, body) {
        //   if (error) {
        //     throw error
        //   }

      //   const data = JSON.parse(body)
      //   reply.view('listall', {
      //     result: data
      //   })
      // })
    }
  },

  // CREATE
  {
    method: 'GET',
    path: '/new',
    handler: function (req, reply) {
      reply.view('new')
    }
  }, {
    method: 'POST',
    path: '/new',
    handler: function (req, reply) {
      // console.log("REceived POST FROM " + req.payload['create-title-name']);

      var todo = {}

      var iscompleted = req.payload['iscompleted-name']

      if (!iscompleted) {
        iscompleted = false
      }
      if (iscompleted === 'on') {
        iscompleted = true
      }      

      todo.title = req.payload['create-title-name']      
      todo.completed = iscompleted

      Wreck.post("http://mint:3000/todos", 
                  {payload: {title: todo.title, 
                  completed: todo.completed}}, 
                  function(err, res, payload) {
                    if(err){
                      throw err
                    }
                    console.log('Wreck:' + res)
                    console.log('Wreck:' + payload)
                  })


      reply.view('new', { result: todo })
    }
  },

  // EDIT
  {
    method: 'GET',
    path: '/edit',
    handler: function (req, reply) {

      // console.log(req.payload)

      reply.view('edit')
    }
  },

  // FIND BY ID
  {
    method: 'GET',
    path: '/listone/{id}',
    handler: function (req, reply) {
      const todoID = encodeURIComponent(req.params.id)
      var url = 'http://mint:3000/todos/' + todoID
      console.log(url)

      statusCodeBad(url, reply, 'listone')

    }
  },

  // FIND BY TITLE
  {
    method: 'GET',
    path: '/todos/title/',
    handler: function (req, reply) {
      reply('find by title')
    }
  }


]
