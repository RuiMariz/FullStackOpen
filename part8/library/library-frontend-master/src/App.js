
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'

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

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(b => b.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) }
      })
    }

    let author = addedBook.author
    author.bookCount++
    const dataInStore2 = client.readQuery({ query: ALL_AUTHORS })
    if (!includedIn(dataInStore2.allAuthors, author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors: dataInStore2.allAuthors.concat(author) }
      })
    } else {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors: dataInStore2.allAuthors.map(a => a.id !== author.id ? a : author) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added`);
      updateCacheWith(addedBook)
    }
  })

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
    setPage('authors')
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
      <LoginForm show={page === 'login'} setError={notify} setUser={setUser} setPage={setPage} />
      <NewBook show={page === 'add'} setError={notify} updateCacheWith={updateCacheWith} />
      <Recommend show={page === 'recommend'} user={user} books={books} />

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