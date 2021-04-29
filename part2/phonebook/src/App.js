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

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  if (type === "error") {
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNewNameFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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
          createNotificationMessage(`${person.name}'s number was updated`, "success")
          setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error)
          createNotificationMessage(error.response.data.error, "error")
        })
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(newPerson => {
        createNotificationMessage(`${personObject.name} was added`, "success")
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log(error)
        createNotificationMessage(error.response.data.error, "error")
      })

  }

  const createNotificationMessage = (message, type) => {
    if (type === "error") {
      setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
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
        .then(() => {
          createNotificationMessage(`${person.name} was removed`, "success")
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => {
          console.log(error)
          createNotificationMessage(error.response.data.error, "error")
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification className="success" message={successMessage} type="success" />
      <Notification className="error" message={errorMessage} type="error" />
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
