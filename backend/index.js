const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');

const { typeDefs, resolvers } = require('./merge_types/merger');
require('dotenv').config();

const startServer = async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    // Log all incoming requests
    app.use((req, res, next) => {
        console.log('Incoming request:', {
            method: req.method,
            path: req.path,
            body: req.body,
        });
        next();
    });

    // Connect to the DB
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req })
    });

    await server.start();
    server.applyMiddleware({ app });

    const port = process.env.PORT || 4255;
    app.listen({ port }, () => {
        console.log(`Server is running at http://localhost:${port}${server.graphqlPath}`);
    });
};

startServer().catch((error) => {
    console.error('Server startup error:', error);
});