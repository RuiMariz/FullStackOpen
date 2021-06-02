
const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('./config')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

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
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    token: String
    id: ID!
  }

  type Query {
    authorCount: Int!
    allAuthors: [Author!]!
    findAuthor(name: String!): Author

    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    findBook(title: String!): Book

    me: User
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

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): User
  }
`

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: () => Author.find({}),
    findAuthor: (root, args) => Author.findOne({ name: args.name }),

    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre)
        return Book.find({}).populate('author')

      let returnedBooks = await Book.find({}).populate('author')

      if (args.author) {
        const byAuthor = (book) =>
          args.author === book.author.name ? book.author : !book.author
        returnedBooks = returnedBooks.filter(byAuthor)
      }
      if (args.genre) {
        const byGenre = (book) =>
          book.genres.includes(args.genre) ? book.genres : !book.genres
        returnedBooks = returnedBooks.filter(byGenre)
      }
      return returnedBooks
    },
    findBook: (root, args) => Book.findOne({ title: args.title }).populate('author'),

    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Author: {
    bookCount: async (root) => {
      const books = await Book.find({}).populate('author')
      return books.filter((book) => book.author.name === root.name).length
    }
  },

  Mutation: {
    addAuthor: (root, args) => {
      const author = new Author({ ...args })
      const errors = author.validateSync()
      if (errors && errors.errors.name.kind === "minlength")
        throw new UserInputError('Author name should have length of at least 3', { invalidArgs: args.name })
      return author.save()
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })
      if (author) {
        author.born = args.setBornTo
        return author.save()
      }
      return null
    },

    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      let author = await Author.findOne({ name: args.author })
      let errors
      if (!author) {
        const newAuthor = new Author({ name: args.author })
        errors = newAuthor.validateSync()
        if (errors && errors.errors.name.kind === "minlength")
          throw new UserInputError('Author name should have length of at least 3', { invalidArgs: args.author })
        author = await newAuthor.save()
      }
      const book = new Book({ title: args.title, published: args.published, author, genres: args.genres })
      errors = book.validateSync()
      if (errors && errors.errors.title.kind === "minlength")
        throw new UserInputError('Title should have length of at least 2', { invalidArgs: args.title })
      return book.save()
    },

    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'password') {
        throw new UserInputError("wrong credentials")
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      user.token=jwt.sign(userForToken, JWT_SECRET)
      return user
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})