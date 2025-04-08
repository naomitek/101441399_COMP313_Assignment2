const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./graphqlapi/schema");
const userResolvers = require("./graphqlapi/userResolvers");
const employeeResolvers = require("./graphqlapi/employeeResolvers");

const PORT = 4000;
const mongoURI = "mongodb+srv://db1399:sunriseme@cluster-2.gxhja.mongodb.net/comp3133_101441399_Assignment2?retryWrites=true&w=majority";

const app = express();
app.use(express.json()); 

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB...`);
    


    // No need for useNewUrlParser or useUnifiedTopology as of MongoDB driver v4.0+
    await mongoose.connect(mongoURI);
    console.log(`MongoDB connected successfully!`);
  } catch (error) {
    console.error(`Error while connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure code
  }
};

// Start server and connect to DB
const startServer = async () => {
  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: {
        ...userResolvers.Query,
        ...employeeResolvers.Query,
      },
      Mutation: {
        ...userResolvers.Mutation,
        ...employeeResolvers.Mutation,
      },
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`The server started running at http://localhost:${PORT}/graphql`);
  });
};

startServer();