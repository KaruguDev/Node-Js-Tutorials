//console.log('Starting notes.js')

//import file system module
const fs = require('fs')

//re-usable functions
const fetchNotes = () => {
  try {
    noteString = fs.readFileSync('notes-data.json')
    notes = JSON.parse(noteString)
    return notes
  } catch (e) {
    return []
  }
}

const saveNotes = (notes) => {
  fs.writeFileSync('notes-data.json', JSON.stringify(notes))
}

//arrow functions
const addNote = (title, body) => {
  var notes = fetchNotes()
  var note = {
    title,
    body
  }

  //check for duplicates
  const duplicateNotes = notes.filter((note) => note.title === title )

  if (duplicateNotes.length === 0){
    notes.push(note)

    //writing notes into file
    saveNotes(notes)
    return note
  }
}

const getAll = () => {
  return fetchNotes()
}

const readNote = (title) => {
  //fetch notes
  notes = fetchNotes()
  //filter notes
  findNote = notes.find((note) => note.title === title)
  //return note
  return findNote
}

const removeNote = (title) => {
  //fetch notes
  notes = fetchNotes()
  //filter note and remove the one with the same title
  toSaveNotes = notes.filter((note) => note.title !== title)
  //save notes
  saveNotes(toSaveNotes)

  return notes.length !== toSaveNotes.length
}

const logNote =  (note) => {
  //debugger
  console.log('--')
  console.log(`Title: ${note.title}`)
  console.log(`Body: ${note.body}`)
}

module.exports = {
  addNote,
  getAll,
  readNote,
  removeNote,
  logNote
}
