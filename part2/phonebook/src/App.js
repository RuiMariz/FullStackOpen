import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = (props) => {
  return (
    <ul>
      {props.persons.map(person => <Person key={person.name} name={person.name}
        number={person.number} nameFilter={props.nameFilter} />)}
    </ul>
  )
}

const Person = (props) => {
  if (props.name.toLowerCase().includes(props.nameFilter.toLowerCase())) {
    return (
      <li>{props.name} {props.number}</li>
    )
  }
  return null
}

const Filter = (props) => {
  return (
    <div>
      filter shown with<input value={props.nameFilter} onChange={props.handleNameFilterChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addName}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
      <button type="submit">add</button>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNewNameFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)
    if (names.indexOf(newName) !== -1) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const noteObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(noteObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleNameFilterChange = (event) => {
    setNewNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} handleNameFilterChange={handleNameFilterChange} />
      <h3>Add new number</h3>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={persons} nameFilter={nameFilter} />
    </div>
  )
}

export default App
