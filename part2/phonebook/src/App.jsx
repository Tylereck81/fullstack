import { useState, useEffect } from 'react'
import axios from 'axios'

const Title = (props) =>{
  return(
    <h2>{props.text}</h2>
  )
}

const Display_Person = (props) =>{ 
  return(
    <div>
      {props.name} {props.phone_number}
    </div>
  )
}

const Persons = ({persons}) =>{ 
  return(
    <div>
    {persons.map(person =>
      <Display_Person key={person.id} name= {person.name} phone_number = {person.number} />
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

  useEffect( () =>{
    axios
      .get("http://localhost:3001/persons")
      .then(response =>{ 
        console.log(response) 
        setPersons(response.data)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true) 
  const [newFilter, setNewFilter] = useState('') 

  
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
    
    //checks if person has already been added to contacts
    if (persons.find(n => n.name === name)){
      let a = `${name} is already added to phonebook`
      alert(a)
    }
    else{
      //created new person object
      const person_object = { 
        name: newName,
        number: newNumber
      }

      axios
        .post('http://localhost:3001/persons', person_object)
        .then(response =>{ 
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')

        })

      
    }
  }

  return (
    <div>
      <Title text="Phonebook" />
      <Filter val = {newFilter} onChange = {handleNewFilter} />
      
      <Title text="add new" />
      <PersonForm addContact = {addContact} 
      newName = {newName} newNumber = {newNumber} 
      handleNewName = {handleNewName} 
      handleNewNumber = {handleNewNumber}/>
      
      <Title text="Numbers" />
      <Persons persons ={namesToShow} />
    </div>
  )
}

export default App
