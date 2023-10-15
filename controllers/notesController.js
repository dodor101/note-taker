const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
module.exports = {
  getNotes: (req, res) => {
    // Send json to the client
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(JSON.parse(data));
      }
    });

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
  },

  // POST request for posting notes
  createNotes: (req, res) => {
    console.log(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };

      fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const parsedNotes = JSON.parse(data);
          parsedNotes.push(newNote);
          fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => {
            err ? console.log(err) : console.log('successfully added note');
          });
        }
      });

      const response = {
        status: 'success',
        body: newNote,
      };

      console.log(response);
      res.json(response);
    } else {
      res.json('unable to post note');
    }
  },

  // DELETE request for notes
  deleteNotes: (req, res) => {
    console.log(`${req.method} request received to delete a note`);
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
      }
      const parsedNotes = JSON.parse(data);
      const deleteNotes = parsedNotes.filter((note) => note.id !== id);

      fs.writeFile('./db/db.json', JSON.stringify(deleteNotes, null, 4), (err) => {
        err ? console.log(err) : console.log('successfully deleted note');
      });
      res.json(`Note deleted`);
    });
  },
};
