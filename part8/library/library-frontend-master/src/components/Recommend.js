import React from 'react'

const Recommend = ({ show, setError, user, books }) => {

  if (!show || !user) {
    return null
  }

  const filterGenre = (books) => {
    let returnedBooks = []
    for (let book of books) {
      if (book.genres.includes(user.favoriteGenre))
        returnedBooks.push(book)
    }
    return returnedBooks
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
          {filterGenre(books).map(a =>
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