const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey';

const resolvers = {
    Query: {
        getAllUsers: async () => {
            const users = await User.find().select('-password');
            console.log('getAllUsers fetched:', users.length);
            return users;
        },
        getUser: async (_, { id }) => {
            const user = await User.findById(id).select('-password');
            console.log('getUser fetched:', user);
            return user;
        },

    },

    Mutation: {
        signUpUser: async (_, { username, email, password }) => {
            console.log('signUpUser called with:', { username, email });
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();
            const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '3h' });
            const userWithoutPassword = await User.findById(user._id).select('-password');
            console.log('User signed up:', userWithoutPassword);
            return { token, user: userWithoutPassword };
        },
        loginUser: async (_, { username, password }) => {
            console.log('loginUser called with:', { username, password });
            const user = await User.findOne({ username });
            if (!user) {
                console.log('User not found for username:', username);
                throw new Error('User not found');
            }
            console.log('User found:', user.username);
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                console.log('Invalid password for user:', username);
                throw new Error('Invalid password');
            }
            console.log('Password valid for user:', username);
            const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '3h' });
            const userWithoutPassword = await User.findById(user._id).select('-password');
            console.log('Login successful, returning token and user:', { token, user: userWithoutPassword });
            return { token, user: userWithoutPassword };
        }
    }
};

module.exports = resolvers;