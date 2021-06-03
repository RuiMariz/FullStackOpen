import { gql } from '@apollo/client'

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    born 
    bookCount
    id
  }
`

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author{
      ...AuthorDetails
    }
    genres
    id
  }
${AUTHOR_DETAILS}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors  {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
query ($genre: String) {
  allBooks(genre: $genre)  {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

export const FIND_AUTHOR = gql`
query findAuthorByName($nameToSearch: String!) {
  findAuthor(name: $nameToSearch) {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born:Int!) {
  editAuthor(
    name: $name,
    setBornTo: $born
  ) {
    ...AuthorDetails
  }
}
${AUTHOR_DETAILS}
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

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`