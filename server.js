// Load tools needed
const express = require('express');
const path = require('path');
const fs = require('fs');
const dbnotes = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const api = require('./routes/index');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api', api);
// The route for notes page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// The request for notes

// Wildcard route to redirect users to landing page
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// Listen to connection
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
