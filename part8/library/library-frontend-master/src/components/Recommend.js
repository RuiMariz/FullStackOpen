import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries'

const Recommend = ({ show, user, books }) => {
  const [booksFiltered, setBooksFiltered] = useState([])
  const [booksWithGenre, result] = useLazyQuery(ALL_BOOKS, { fetchPolicy: "no-cache" })

  useEffect(() => {
    if (user) {
      booksWithGenre({ variables: { genre: user.favoriteGenre } })
    }
  }, [booksWithGenre, user, books])

  useEffect(() => {
    if (result.data) {
      setBooksFiltered(result.data.allBooks)
    }
  }, [result])

  if (!show || !user) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre <strong>{user.favoriteGenre}</strong></div>
      <br />
      <table>
        <tbody>
          <tr>
            <th>
              title
            </th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksFiltered.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend