
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useQuery, useApolloClient } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

let previousTimeOutId = null

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)

  useEffect(() => {
    const token = localStorage.getItem('libraryAppToken')
    if (token)
      setToken(token)

  }, [])

  if (resultAuthors.loading || resultBooks.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    clearTimeout(previousTimeOutId)
    previousTimeOutId = setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token !== null ?
          <div>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </div>
          :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors authors={resultAuthors.data.allAuthors} show={page === 'authors'} setError={notify} token={token} />
      <Books books={resultBooks.data.allBooks} show={page === 'books'} />
      <LoginForm show={page === 'login'} setError={notify} setToken={setToken} />
      <NewBook show={page === 'add'} setError={notify} />

    </div>
  )
}

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}

export default App