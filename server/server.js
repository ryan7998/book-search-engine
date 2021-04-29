const express = require('express');
const path = require('path');
//  Implement the Apollo Server and apply it to the Express server as middleware
const {ApolloServer} = require ('apollo-server-express');
// const routes = require('./routes');

const {typeDefs, resolvers} = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({typeDefs, resolvers, context:authMiddleware});

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({app});

app.use(express.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
