const router = require('express').Router();
const { getNotes, createNotes, deleteNotes } = require('../controllers/notesController');

router.get('/', getNotes).post('/', createNotes).delete('/:id', deleteNotes);
module.exports = router;
