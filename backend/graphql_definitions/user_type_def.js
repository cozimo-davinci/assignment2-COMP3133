const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getAllUsers: [User!]
    getUser(id: ID!): User
  }

  type Mutation {
    signUpUser(username: String!, email: String!, password: String!): AuthPayload!
    loginUser(username: String!, password: String!): AuthPayload! # Moved here
  }

  type Subscription {
    userAdded: User
  }
`;

module.exports = typeDefs;