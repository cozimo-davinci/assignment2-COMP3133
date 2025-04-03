const { gql } = require('apollo-server-express');


const typeDefs = gql`

    scalar Date


    type Employee {
        _id: ID!,
        first_name: String!,
        last_name: String!,
        email: String!,
        gender: String!,
        designation: String!,
        salary: Float!,
        date_of_joining: Date!,
        department: String!,
        employee_photo: String!,

    }

    type Query {
        getAllEmployees: [Employee!]
        getEmployee(_id: ID!): Employee
        getEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee!]!
    }

    type Mutation {
        addEmployee(
            first_name: String, last_name: String,
            email: String, gender: String, designation: String,
            salary: Float, date_of_joining: Date, department: String,
            employee_photo: String,  
            ): Employee!
        
        updateEmployee(
            _id: ID, first_name: String, last_name: String,
            email: String, gender: String, designation: String,
            salary: Float, date_of_joining: Date, department: String,
            employee_photo: String,  
        ): Employee!  
        

        deleteEmployee(_id: ID!): Employee
    }

    type Subscription {
        employeeAdded: Employee!
        employeeUpdated: Employee!
        employeeDeleted: Employee!
       
    
    }
    
    `;

module.exports = typeDefs;




