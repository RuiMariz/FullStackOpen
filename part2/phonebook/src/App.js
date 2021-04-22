import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Persons = (props) => {
  return (
    <ul>
      {props.persons.map(person => <Person key={person.name} name={person.name}
        number={person.number} nameFilter={props.nameFilter} removePerson={props.removePerson} />)}
    </ul>
  )
}

const Person = (props) => {
  if (props.name.toLowerCase().includes(props.nameFilter.toLowerCase())) {
    return (
      <div>
        <li>{props.name} {props.number}</li>
        <button onClick={() => props.removePerson(props.name)}>remove</button>
      </div>
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
    <form onSubmit={props.addPerson}>
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
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(p => p.name === newName)
    if (person) {
      if (!window.confirm(`${person.name} is already added to the phonebook, replace the old number with the new one?`))
        return
      const noteObject = {
        name: newName,
        number: newNumber
      }

      personService
        .update(person.id, noteObject)
        .then(updatedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error)
        })
      return
    }

    const noteObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(noteObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log(error)
      })

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
  const removePerson = (name) => {
    if (window.confirm(`Remove ${name}?`)) {
      const person = persons.find(p => p.name === name)
      personService
        .remove(person.id)
        .then(setPersons([...persons].filter(p => p.id !== person.id)))
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={nameFilter} handleNameFilterChange={handleNameFilterChange} />
      <h3>Add new number</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={persons} nameFilter={nameFilter} removePerson={removePerson} />
    </div>
  )
}

export default App
