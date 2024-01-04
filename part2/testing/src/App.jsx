import {useState} from 'react'
import Note from './components/Note'

const App =(props) =>{ 
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true) 

  const addNotes = (event) =>{ 
    event.preventDefault() 
    const noteObject = {
      content: newNote, 
      important: Math.random() < 0.5, 
      id: notes.length+1
    }

    setNotes(notes.concat(noteObject))
    setNewNote('')
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
      <ul>
        {notestoShow.map(note => 
          <Note key= {note.id} note = {note} />
        )}
      </ul>
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