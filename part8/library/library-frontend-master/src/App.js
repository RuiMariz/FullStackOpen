
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useQuery, useApolloClient } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

let previousTimeOutId = null

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const client = useApolloClient()

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('libraryAppUser'))
    if (user)
      setUser(user)
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
    setUser(null)
    localStorage.clear()
    client.resetStore()
  }

  const authors = resultAuthors.data.allAuthors
  const books = resultBooks.data.allBooks

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {user !== null ?
          <div>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </div>
          :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors authors={authors} show={page === 'authors'} setError={notify} user={user} />
      <Books books={books} show={page === 'books'} />
      <LoginForm show={page === 'login'} setError={notify} setUser={setUser} />
      <NewBook show={page === 'add'} setError={notify} />
      <Recommend show={page === 'recommend'} setError={notify} user={user} books={books} />

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