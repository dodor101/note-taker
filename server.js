// Load tools needed
const express = require('express');
const path = require('path');
const fs = require('fs');
const dbnotes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// The route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// The request for notes
app.get('/api/notes', (req, res) => {
  // Send json to the client
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(JSON.parse(data));

    }
  })

  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
});

// POST request for posting notes
app.post('/api/notes', (req, res) => {
  console.log(`${req.method} request received to add a note`)

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4()
    }

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote)
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => {
          err ? console.log(err) : console.log('successfully added note')
        })
      }
    })

    const response = {
      status: 'success',
      body: newNote
    }

    console.log(response);
    res.json(response);
  } else {
    res.json('unable to post note')
  }
});

// DELETE request for notes
app.delete('/api/notes/:id', (req, res) => {
  console.log(`${req.method} request received to delete a note`)
  const id = req.params.id;
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    }
    const parsedNotes = JSON.parse(data);
    const deleteNotes = parsedNotes.filter((note) => note.id !== id);

    fs.writeFile('./db/db.json', JSON.stringify(deleteNotes, null, 4), (err) => {
      err ? console.log(err) : console.log('successfully deleted note')
    })
    res.json(`Note deleted`);
  })
});

// Wildcard route to redirect users to landing page
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Listen to connection 
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});