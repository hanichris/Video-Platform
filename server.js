const express = require('express');
const routes = require('./routes/index');
const dbClient = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 5000;

setTimeout(() => {
  if (dbClient.isAlive()) {
    console.log('MongoDB is connected');
  } else {
    console.log('MongoDB is not connected');
  }
}, 1000);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
