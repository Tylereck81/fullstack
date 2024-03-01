const express = require('express') 
const app = express()

app.use(express.json())

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

app.get('/info', (request,response)=>{
    const maxInt = person.length > 0
    ? Math.max(...person.map(n =>n.id))
    : 0  
    const newdate = new Date(); 
    const newtime = newdate.toString();
    response.send(
        'Phonebook has info for '+maxInt+' people<br><br>'+newtime
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

const PORT = 3001 
app.listen(PORT, () =>{ 
    console.log(`Server running on port ${PORT}`)
})

