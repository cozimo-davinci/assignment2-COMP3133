const Employee = require("../models/employeeSchema");
const { GraphQLScalarType, Kind } = require("graphql");

// define the custom Date scalar
const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return value instanceof Date ? value.toISOString() : null;
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;

    }
});


const functions = {
    Query: {
        getAllEmployees: async () => {
            return await Employee.find();
        },
        getEmployee: async (_, { _id }) => {
            const employee = await Employee.findById(_id);
            if (!employee) {
                throw new Error("Employee not found");
            }
            return employee;
        },
        getEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
            if (!designation && !department) {
                throw new Error("Please provide either designation or department");
            }

            const employees = await Employee.find({
                $or: [
                    designation ? { designation } : null,
                    department ? { department } : null
                ].filter(Boolean) // Removes the null values
            });

            if (employees.length === 0) {
                throw new Error("No employees found for the given criteria.");
            }
            return employees;
        }
    },

    Mutation: {
        addEmployee: async (_, {
            first_name, last_name, email, gender, designation,
            salary, date_of_joining, department, employee_photo
        }) => {
            const existingEmployee = await Employee.findOne({ email });
            if (existingEmployee) {
                throw new Error("Employee already exists");
            }

            const newEmployee = new Employee({
                first_name,
                last_name,
                email,
                gender,
                designation,
                salary,
                date_of_joining,
                department,
                employee_photo
            });

            await newEmployee.save();
            return newEmployee;
        },

        updateEmployee: async (_, { _id, first_name, last_name, email, gender, designation,
            salary, date_of_joining, department, employee_photo }) => {
            const updatedEmployee = await Employee.findByIdAndUpdate(
                _id,
                { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo },
                { new: true }
            );

            if (!updatedEmployee) {
                throw new Error("Employee not found");
            }

            return updatedEmployee;
        },

        deleteEmployee: async (_, { _id }) => {
            const deletedEmployee = await Employee.findByIdAndDelete(_id);

            if (!deletedEmployee) {
                throw new Error("Employee not found");
            }

            return deletedEmployee;
        }
    },

    Date: DateScalar
};

module.exports = functions;

