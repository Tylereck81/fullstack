import {useState, useEffect} from 'react'
import Note from './components/Note'
import axios from 'axios'
import noteService from './services/notes'


const App =() =>{
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) 

  //changing the notes important 
  const toggleImportanceof = (id) =>{ 
    const note = notes.find(n => n.id == id)
    const changeNote = { ...note, important: !note.important}

    noteService
      .update(id,changeNote)
      .then(returnedNote=>{ 
        setNotes(notes.map(n=>n.id !== id ? n: returnedNote))
      })
      .catch(error =>{ 
        alert(`the note '${note.content}' was already deleted from the server`)
      })
      setNotes(notes.filter(n =>n.id !== id))
  }

  //initially loading notes from db 
  useEffect(() =>{ 
    noteService 
      .getAll()
      .then(initialNotes =>{ 
        setNotes(initialNotes)
      })

  } ,[])

  //adding a note
  const addNotes = (event) =>{ 
    event.preventDefault() 
    const noteObject = {
      content: newNote, 
      important: Math.random() < 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote =>{ 
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }


  const handleNewNote = (event) =>{ 
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notestoShow = showAll
  ? notes
  : notes.filter(note => note.important === true)

  return(
    <div>
      <h1> Notes</h1>
      <div> 
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <h2> Important Notes: </h2>
      <ul>
        {notestoShow.map(note => 
          <Note key= {note.id} note = {note} toggleImportance={() => toggleImportanceof(note.id)}/>
        )}
      </ul>
      <h2>ALL NOTES: </h2>
      <ul>
        {notes.map(note =>
          <Note key={note.id} note = {note}/>
        )}
      </ul>
      <form onSubmit={addNotes}>
        <input value = {newNote} onChange={handleNewNote}/>
        <button type ="submit">save</button>
      </form>
    </div>
  )
}
export default App