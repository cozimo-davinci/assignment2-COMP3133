const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    designation: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true,
        min: [1000, 'Value must be at least 1000$']

    },
    date_of_joining: {
        type: Date,
        default: Date.now,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    employee_photo: {
        type: String,
        required: true,
    },

},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Employee', employeeSchema);