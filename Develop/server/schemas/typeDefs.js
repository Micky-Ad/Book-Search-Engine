const { gql } = require("apollo-server-express");

const typeDefs = gql`
  input BookInput {
    authors: [String]
    describtion: String
    title: String
    bookId: String
    image: String
    link: String
  }
  type Query {
    me: User
  }
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    descripion: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: String
    user: User
  }

  type Mutation {
    login(email: String, password: String): Auth
    addUser(username: String, email: String, password: String): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
