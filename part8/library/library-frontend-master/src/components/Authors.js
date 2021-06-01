
import React, { useState } from 'react'
import { EDIT_AUTHOR } from '../queries'
import { useMutation } from '@apollo/client'

const Authors = ({ show, authors, setError, token }) => {
  const [name, setName] = useState(authors[0] ? authors[0].name : null)
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({ variables: { name, born: parseInt(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {token &&
        <div>
          <h2>set birth year</h2>
          <form onSubmit={submit}>
            name<select onChange={({ target }) => setName(target.value)}>
              {authors.map(author => <option value={author.name} key={author.id}>{author.name}</option>)}
            </select><br />
        born<input value={born} name="born" onChange={({ target }) => setBorn(target.value)} required /><br />
            <button type='submit'>update author</button>
          </form>
        </div>
      }
    </div>
  )
}

export default Authors
