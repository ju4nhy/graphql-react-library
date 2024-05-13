const { UserInputError, AuthenticationError} = require('apollo-server')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allUsers: async (root, args) => {
          const users = await User.find({})
          return users
        },
        allAuthors: async (root, args) => {
          const authors = await Author.find({}).populate('books')
          return authors
        },
        allBooks: async (root, args) => {
          let books = await Book.find({}).populate('author')
          
          if(args.author && args.genre) {
            const booksByAuthor = books.filter(book => book.author.name === args.author)
            const filteredBooks = booksByAuthor.filter(book => book.genres.includes(args.genre))
            return filteredBooks
          } 
          if(args.author) {
            let filteredBooks = books.filter(book => book.author.name === args.author)
            return filteredBooks
          } 
          if(args.genre) {
            let filteredBooks = books.filter(book => book.genres.includes(args.genre))
            return filteredBooks
          } 
          return books
        },
        me: (root, args, context) => {
          return context.currentUser
        },
    },
    Author: {
      name: (root) => root.name,
      born: (root) => root.born,
      books: (root) => root.books,
      bookCount: async (root) => {
        return root.books.length
      },
      id: (root) => root.id
    },
    Mutation: {
      addBook: async (root, args, context) => {
        let author = await Author.findOne({ name: args.author })
  
        if (!context.currentUser) {
          throw new AuthenticationError("Cannot add book. User is not authenticated.")
        }
  
        if (!author) {
          author = new Author({
            name: args.author,
            born: null,
          })
        }
  
        let book = new Book({ ...args, author: author })
  
        try {
          author.books = author.books.concat(book)
          await author.save()
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: book })

        return book
      },
      editAuthor: async (root, args, context) => {
        if (!context.currentUser) {
          throw new AuthenticationError("Cannot edit author. User is not authenticated.")
        }
        
        const author = await Author.findOne({ name: args.name })
        author.born = args.setBornTo || args.born
  
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return author
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre || null })
  
        return user.save()
          .catch(error => {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
  
        if ( !user || args.password !== '1234' ) {
          throw new UserInputError("Wrong credentials")
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
        console.log(userForToken)
    
        return { value: jwt.sign(userForToken, JWT_SECRET) }
      },
      bookAdded: async (root, args, context) => {
        const book = new Book({ ...args })

        const currentUser = context.currentUser
        if (!currentUser) {
            throw new AuthenticationError("not authenticated")
        }

        try {
            await book.save()
            currentUser.books = currentUser.books.concat(book)
            await currentUser.save()
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
        }
      
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        
        return book
        },
    },
    Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        },
    },
}

module.exports = resolvers