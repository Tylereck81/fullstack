const express = require('express') 
// const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.static('dist'))

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

app.get('/', (request,response)=>{ 
  response.send('<h1>HELLO WORLD</h1>')
})

app.get('/info', (request,response)=>{
    const numPer = person.length
    const newdate = new Date(); 
    const newtime = newdate.toString();
    response.send(
        'Phonebook has info for '+numPer+' people<br><br>'+newtime
    )
})

app.get('/api/persons', (request, response) =>{ 
    response.json(person)
})


app.get('/api/persons/:id', (request, response) =>{ 
    const id = Number(request.params.id)
    const p = person.find(p => p.id === id)

    if(p){ 
        response.json(p)
    }
    else{ 
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{ 
  const id = Number(request.params.id)
  person = person.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response)=>{
  const randInt = Math.floor(Math.random() * (10000 - 1)+ 1) 
  const p = request.body 

  const isUnique = person.find(pers => pers.name === p.name)

  if(!p.name){ 
    return response.status(400).json({ 
      error: 'name missing'
    })
  }
  if(!p.number){ 
    return response.status(400).json({ 
      error: 'number missing'
    })
  }
  if(isUnique){ 
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const per = { 
    id : randInt, 
    name: p.name, 
    number: p.number 
  }

  person = person.concat(per)
  console.log(per)
  response.json(per)

})

const PORT = process.env.PORT || 3001 
app.listen(PORT, () =>{ 
    console.log(`Server running on port ${PORT}`)
})

