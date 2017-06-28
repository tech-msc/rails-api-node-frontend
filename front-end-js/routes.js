const Request = require('request')
const LodashFilter = require('lodash.filter')
const LodashTake = require('lodash.take')
const Boom = require('boom')
const Wreck = require('wreck')

// boom error handler if not exist errors, return REPLY
var statusCodeBad = function (url, reply, view) {
  Wreck.get(url, function (error, response, body) {
    if (error) {
      throw error
    }

    if (response.statusCode >= 400) {
      reply(Boom.notFound('Boom: Todo not found'))
    }

    const data = JSON.parse(body)
    reply.view(view, {
      result: data
    })
  })
}



module.exports = [


  // INDEX WITH DATA
  {
    method: 'GET',
    path: '/',
    handler: function (req, reply) {
      var url = 'http://mint:3000/todos'
      statusCodeBad(url, reply, 'index')
    }
  },

  {
    method: 'GET',
    path: '/index',
    handler: function (req, reply) {
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
    }
  },

  // NEW
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

      Wreck.post('http://mint:3000/todos', {
          payload: {
            title: todo.title,
            completed: todo.completed
          }
        },
        function (err, res, payload) {
          if (err) {
            throw err
          }
          // console.log('Wreck:' + res)
          // console.log('Wreck:' + payload)
        })

      // reply.view('new', {
      //   result: todo
      // })
      reply.view('new', {
        result: todo
      })
    }
  },

  // EDIT
  {
    method: 'GET',
    path: '/edit',
    handler: function (req, reply) {
      // console.log('Auau:' + req.payload)

      reply.view('edit')
    }
  }, {
    method: 'GET',
    path: '/edit/{id}',
    handler: function (req, reply) {
      var url = 'http://mint:3000/todos/' + encodeURIComponent(req.params.id)

      statusCodeBad(url, reply, 'edit')

      // reply.view('edit')
    }
  },

  // PUT/EDIT
  {
    method: 'POST',
    path: '/edit/{id}',
    handler: function (req, reply) {
      var todoID = encodeURIComponent(req.params.id)
      var url = 'http://mint:3000/todos/' + todoID

      var todo = {}

      var iscompleted = req.payload['iscompleted-name']
      

      if (!iscompleted) {
        iscompleted = false
      }
      if (iscompleted === 'on') {
        iscompleted = true
      }

      todo.id = todoID
      todo.title = req.payload['edit-title-name']
      todo.completed = iscompleted

      Wreck.put(url, {
          payload: {
            title: todo.title,
            completed: todo.completed
          }
        },
        function (err, res, payload) {
          if (err) {
            throw err
          }
          // console.log('Wreck Resp: ' + res)
          // console.log('Wreck Payload: ' + payload)
        })

      reply.view('edit', {
        resultEdited: todo
      })
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

  // DELETE 
  {
    method: 'GET',
    path: '/delete/{id}',
    handler: function (req, reply) {
      var todoID = encodeURIComponent(req.params.id)

      var url = "http://mint:3000/todos/" + todoID

      var todoDeleted = {}
      
      // GET DELETED ITEM - to feedback
      Wreck.get(url, function (err, res, body) {
        if (err) {          
            throw err
          }
        todoDeleted = JSON.parse(body)
      })

      // DELETE ITEM
      Wreck.delete(url, function (error, res, payload) {
        if (error) {
          throw error
        }
        reply.view('delete', { result: todoDeleted })

      })

    }
  }

]
