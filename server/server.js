const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const mealDBRoutes = require('./routes/apiRoutes');

require('dotenv').config();

const PORT = Number.parseInt(process.env.PORT) || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // For development
  // res.header("Access-Control-Allow-Origin", "https://tbohn2.github.io"); // For production
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // if (req.method === 'OPTIONS') {
  //   return res.status(200).end();
  // }

  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(mealDBRoutes);

const staticPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  console.log(`✓ Serving static files from ${staticPath}`);
} else {
  console.error(`ERROR: Static files directory not found at ${staticPath}`);
}

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });


  const distPath = path.join(__dirname, '../client/dist');
  const indexPath = path.join(distPath, 'index.html');

  console.log(`✓ Serving static files from ${distPath}`);

  // Verify dist folder exists
  if (!fs.existsSync(distPath)) {
    console.error(`ERROR: dist folder not found at ${distPath}`);
    console.error(`Current __dirname: ${__dirname}`);
    console.error(`Resolved absolute path: ${path.resolve(distPath)}`);

    app.get('*', (req, res) => {
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Error sending index.html: ${err.message}`);
          console.error(`Attempted path: ${indexPath}`);
          res.status(500).send('Error loading application');
        }
      });
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer();