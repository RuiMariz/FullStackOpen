import React, { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNewNameFilter] = useState('')

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

  const Name = (props) => {
    if (props.name.toLowerCase().includes(nameFilter.toLowerCase())) {
      return (
        <li>{props.name} {props.number}</li>
      )
    }
    return null
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with<input value={nameFilter} onChange={handleNameFilterChange} /></div>
      <h2>Add new number</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => <Name key={person.name} name={person.name} number={person.number} />)}
      </ul>
    </div>
  )
}

export default App
