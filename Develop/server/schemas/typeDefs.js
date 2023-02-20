const { gql } = require("apollo-server-express");

const typeDefs = gql`
  # Define which fields are accessible from the model
  input BookInput {
    authors: [String]
    describtion: String
    title: String
    bookId: String
    image: String
    link: String
  }
  # Define which queries the front end is allowed to make and what data is returned
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
    description: String
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
