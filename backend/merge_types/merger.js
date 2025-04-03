const { mergeTypeDefs } = require('@graphql-tools/merge')
const { mergeResolvers } = require('@graphql-tools/merge')


// Import all type definitions and  resolvers

const employeeTypeDefs = require('../graphql_definitions/employee_type_def');
const userTypeDefs = require('../graphql_definitions/user_type_def');
const employeeResolver = require('../resolvers/employeeResolvers');
const userResolver = require('../resolvers/userResolver');


// Merge them
const typeDefs = mergeTypeDefs([employeeTypeDefs, userTypeDefs]);
const resolvers = mergeResolvers([employeeResolver, userResolver]);

module.exports = { typeDefs, resolvers };