const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allUsers: [User!]
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    me: User
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
    books: [Book]
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book,
    editAuthor(
      name: String!
      born: Int
      setBornTo: Int
      bookCount: Int
    ) : Author,
    createUser(
      username: String!
      favoriteGenre: String!
    ): User,
    login(
      username: String!
      password: String!
    ): Token,
    bookAdded(
      title: String!
    ): Book!
  } 

  type Subscription {
    bookAdded: Book!
  }  
`

module.exports = typeDefs