import React, { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)
    if (names.indexOf(newName) !== -1) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const noteObject = {
      name: newName
    }

    setPersons(persons.concat(noteObject))
    setNewName('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const Name = (props) => {
    return (
      <li>{props.name}</li>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => <Name key={person.name} name={person.name} />)}
      </ul>
    </div>
  )
}

export default App
