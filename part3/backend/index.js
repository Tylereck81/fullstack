require('dotenv').config()
const express = require('express') 
const app = express()
const cors = require('cors')
const Note = require('./models/note')

app.use(express.json())
app.use(cors())
app.use(express.static('dist')) 

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]


app.get('/api/notes', (request, response) =>{ 
    Note.find({}).then(notes =>{ 
        response.json(notes)
    })
})

app.delete('/api/notes/:id', (request, response)=>{ 
    const id1 = Number(request.params.id)
    Note.find({id: id1}).then(notes =>{ 
        response.json(notes)
    })

    response.status(204).end()
})

app.get('/api/notes/:id', (request, response) =>{ 
    Note.findbyId(request.params.id).then(note =>{ 
        response.json(note)
    })
})

app.post('/api/notes', (request,response) =>{ 
    const body = request.body 

    if (body.content === undefined){ 
        return response.status(400).json({ 
            error: 'content missing'
        })
    }

    const note = new Note({ 
        content: body.content, 
        important: body.important || false, 
    })

    note.save().then(savedNote =>{ 
        response.json(savedNote)
    })
})

const PORT = process.env.PORT 
app.listen(PORT, () =>{ 
    console.log(`Server running on port ${PORT}`)
})

