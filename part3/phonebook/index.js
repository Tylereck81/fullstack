require('dotenv').config()
const express = require('express') 
// const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.static('dist'))
const Contact = require('./models/contact')

app.use(express.json())
app.use(cors())

// morgan.token('req-body', (req) => JSON.stringify(req.body))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let person = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// const requestLogger = (request, response, next) =>{ 
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// app.use(requestLogger)

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

// app.get('/', (request,response)=>{ 
//   response.send('<h1>HELLO WORLD</h1>')
// })

// app.get('/info', (request,response)=>{
//     const numPer = person.length
//     const newdate = new Date(); 
//     const newtime = newdate.toString();
//     response.send(
//         'Phonebook has info for '+numPer+' people<br><br>'+newtime
//     )
// })

app.get('/api/persons', (request, response) =>{ 
    Contact.find({}).then(contacts =>{ 
      response.json(contacts)
  })
})

app.get('/api/persons/:id', (request, response) =>{ 
    Contact.findById(request.params.id).then(contact =>{ 
      response.json(contact)
  })
})

// app.delete('/api/persons/:id', (request, response)=>{ 
//   const id = Number(request.params.id)
//   person = person.filter(p => p.id !== id)

//   response.status(204).end()
// })

app.post('/api/persons', (request, response)=>{
  const body = request.body 

  if (body.name === undefined || body.number === undefined){ 
      return response.status(400).json({ 
          error: 'content missing'
      })
  }

  const person = new Contact({ 
      name: body.name, 
      number: body.number, 
  })

  person.save().then(savedPerson =>{ 
      response.json(savedPerson)
  })

})

const PORT = process.env.PORT
app.listen(PORT, () =>{ 
    console.log(`Server running on port ${PORT}`)
})