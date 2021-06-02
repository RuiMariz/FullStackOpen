import React, { useState } from 'react'

const Books = ({ show, books }) => {
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([])

  const filterGenre = (books) => {
    if (selectedGenre === '')
      return books
    let returnedBooks = []
    for (let book of books) {
      if (book.genres.includes(selectedGenre))
        returnedBooks.push(book)
    }
    return returnedBooks
  }

  for (let book of books) {
    for (let genre of book.genres) {
      if (!genres.includes(genre)) {
        setGenres(genres.concat(genre))
      }
    }
  }


  if (!show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      genre<select onChange={({ target }) => setSelectedGenre(target.value)}>
        <option value={''}></option>
        {genres.map(genre => <option value={genre} key={genre}>{genre}</option>)}
      </select><br /><br />
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

export default Books