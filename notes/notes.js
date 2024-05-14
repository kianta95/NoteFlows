const notes = require('express').Router();

const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

 // GET Route for retrieving all the note

notes.get('/', (req, res) =>{
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

  // POST Route for a new UX/UI note
  notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a tip`);
    console.log(req.body);
    
  const noteTitle = req.body.title;
  const notetextarea = req.body.text;

  if (noteTitle && notetextarea ) {
    const newNote = {
        'title':noteTitle,
        'text':notetextarea,
        'id': uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Notes added successfully`);
  } else {
    res.json('Error in adding Notes');
  }
  });

  // DELETE Route for a specific note
  notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      console.log(json.filter((note) => note.id !== noteId));
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item has been deleted 🗑️`);
    });
});

  
  

module.exports = notes;