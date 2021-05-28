
const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    genres:[String!]!
    id: ID!
  }

  type Query {
    authorCount: Int!
    allAuthors: [Author!]!
    findAuthor(name: String!): Author

    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    findBook(title: String!): Book
  }

  type Mutation {
    addAuthor(
      name: String!
      born: Int
    ): Author
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    addBook(
      title: String!
      published: Int!
      author: String!
      genres:[String!]!
    ): Book
  }
`

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    allAuthors: () => authors,
    findAuthor: (root, args) =>
      authors.find(a => a.name === args.name),

    bookCount: () => books.length,
    allBooks: (root, args) => {
      if (!args.author && !args.genre) {
        return books
      }

      let returnedBooks = books
      if (args.author) {
        const byAuthor = (book) =>
          args.author === book.author ? book.author : !book.author
        returnedBooks = returnedBooks.filter(byAuthor)
      }
      if (args.genre) {
        const byGenre = (book) =>
          book.genres.includes(args.genre) ? book.genres : !book.genres
        returnedBooks = returnedBooks.filter(byGenre)
      }
      return returnedBooks
    },
    findBook: (root, args) =>
      books.find(b => b.title === args.title)
  },

  Author: {
    bookCount: (root) => {
      return books.filter((book) => book.author === root.name).length
    }
  },

  Mutation: {
    addAuthor: (root, args) => {
      if (authors.find(a => a.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name,
        })
      }
      const author = { ...args, id: uuid() }
      authors = authors.concat(author)
      return author
    },
    editAuthor: (root, args) => {
      for(author of authors){
        if(author.name===args.name){
          author.born=args.setBornTo
          return author
        }
      }
      return null
    },

    addBook: (root, args) => {
      if (books.find(b => b.title === args.title)) {
        throw new UserInputError('Title must be unique', {
          invalidArgs: args.name,
        })
      }
      const book = { ...args, id: uuid() }
      books = books.concat(book)
      if (authors.findIndex(author => author.name === book.author) === -1) {
        const newAuthor = { name: book.author, id: uuid() }
        authors = authors.concat(newAuthor)
      }
      return book
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})