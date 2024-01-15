import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import persons from './services/persons'

const Notification = ({type, message}) =>{ 
  if(message === null){ 
    return null
  }
  return (
    <div className={type}>
      {message} 
    </div>
  )
}

const Title = (props) =>{
  return(
    <h2>{props.text}</h2>
  )
}

const Display_Person = (props) =>{ 
  return(
    <div>
      {props.name} {props.phone_number} 
      <button onClick={props.deleteContact}>delete</button>
    </div>
  )
}

const Persons = ({persons, deleteContactOf}) =>{ 
  return(
    <div>
    {persons.map(person=>
      <Display_Person key={person.id} name= {person.name} phone_number = {person.number} deleteContact = {() => deleteContactOf(person.id)} />
    )}
    </div>
  )
}

const PersonForm = (props) =>{ 
  return(
    <div>
      <form onSubmit= {props.addContact}>
        <div>
          name: <input value={props.newName} onChange={props.handleNewName}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNewNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Filter = (props) =>{ 
  return(
    <div>
      filter shown with <input value={props.val} onChange={props.onChange}></input>
    </div>
  )
}



const App = () => {

  //Application States
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true) 
  const [newFilter, setNewFilter] = useState('') 
  const [message, setMessage] = useState('some notification')
  const [type, setType] = useState('')

  //gets inital list of contacts in phonebook
  useEffect( () =>{
    personService 
      .getAll() 
      .then(initialContacts =>{ 
        console.log(initialContacts) 
        setPersons(initialContacts)
      })
  }, [])

  const deleteContactOf = (key) =>{ 
    const p = persons.find(p=> p.id === key)
    if(window.confirm("Delete "+ p.name+"?")){
      personService
        .del(key)
        .then(response =>{ 
          setPersons(persons.filter(p => p.id !== key) )
        })
    }
  }
  
  //event handlers
  const handleNewName =(event) =>{ 
    setNewName(event.target.value)
  }
  const handleNewNumber =(event) =>{ 
    setNewNumber(event.target.value)
  }

  //when person types a filter and its not empty, we change showAll
  const handleNewFilter =(event) =>{ 
    setNewFilter(event.target.value)
    if (event.target.value === ""){ 
      setShowAll(true)
    }
    else{ 
      setShowAll(false)
    }
  }

  //filters name object list
  const namesToShow = showAll
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(newFilter.toLowerCase()))

  //adding a person to the phonebook
  const addContact = (event) =>{ 
    event.preventDefault() 
    const name = newName
    const person = persons.find(n => n.name === name)
    
    //checks if person has already been added to contacts
    if (person){
      let a = `${person.name} is already added to phonebook, replace the old number with a new one?`

      //confirm user wants to replace the number
      if(window.confirm(a)){ 
        const person_object = { ...person, number: newNumber}

        personService
        .update(person.id, person_object) 
        .then(newPerson =>{ 
          setPersons(persons.map(p => p.id !== person.id ? p: newPerson ))
          setNewName('')
          setNewNumber('')
        })

      }
    }
    else{
      //created new person object
      const person_object = { 
        name: newName,
        number: newNumber
      }

      personService
        .create(person_object) 
        .then(newPerson =>{ 
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')

          setType('notif')
          setMessage(`Added ${person_object.name}`)

          setTimeout(()=>{
            setMessage(null)
            setType(null)
          },5000)
        })
      

    }
  }

  return (
    <div>
      <Title text="Phonebook" />
      <Notification type={type} message={message} />
      <Filter val = {newFilter} onChange = {handleNewFilter} />
      
      <Title text="add new" />
      <PersonForm addContact = {addContact} 
      newName = {newName} newNumber = {newNumber} 
      handleNewName = {handleNewName} 
      handleNewNumber = {handleNewNumber}/>
      
      <Title text="Numbers" />
      <Persons persons ={namesToShow} deleteContactOf = {deleteContactOf}/>
    </div>
  )
}

export default App
