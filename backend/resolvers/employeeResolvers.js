const Employee = require("../models/employeeSchema");
const { GraphQLScalarType, Kind } = require("graphql");

const DateScalar = new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
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
    },
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
                $or: [designation ? { designation } : null, department ? { department } : null].filter(
                    Boolean
                ),
            });
            if (employees.length === 0) {
                throw new Error("No employees found for the given criteria.");
            }
            return employees;
        },
    },
    Mutation: {
        addEmployee: async (_, { input }) => {
            const existingEmployee = await Employee.findOne({ email: input.email });
            if (existingEmployee) {
                throw new Error("Employee already exists");
            }
            const newEmployee = new Employee(input);
            await newEmployee.save();
            return newEmployee;
        },
        addMultipleEmployees: async (_, { inputs }) => {
            const emails = inputs.map((i) => i.email);
            const existingEmployees = await Employee.find({ email: { $in: emails } }, "email");
            if (existingEmployees.length > 0) {
                const existingEmails = existingEmployees.map((e) => e.email).join(", ");
                throw new Error(`Employees with emails ${existingEmails} already exist`);
            }
            const result = await Employee.insertMany(inputs);
            return result;
        },
        updateEmployee: async (_, { _id, ...updates }) => {
            const updatedEmployee = await Employee.findByIdAndUpdate(_id, updates, { new: true });
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
        },
    },
    Date: DateScalar,
};

module.exports = functions;