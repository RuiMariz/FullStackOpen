import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors  {
    name
    born
    bookCount
    id
  }
}
`

export const ALL_BOOKS = gql`
query ($genre: String) {
  allBooks(genre: $genre)  {
    title
    published
    author{
      name
      born
      bookCount
      id
    }
    genres
    id
  }
}
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    title
    published
    author{
      name
      born
      bookCount
      id
    }
    genres
    id
  }
}
`

export const FIND_AUTHOR = gql`
  query findAuthorByName($nameToSearch: String!) {
    findAuthor(name: $nameToSearch) {
      name
      born
      bookCount
      id
    }
  }
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born:Int!) {
  editAuthor(
    name: $name,
    setBornTo: $born
  ) {
    name
    born
    bookCount
    id
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  { 
        username
        favoriteGenre
        token
        id    
    }
  }
`