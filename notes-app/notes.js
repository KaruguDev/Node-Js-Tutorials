//console.log('Starting notes.js')

//import file system module
const fs = require('fs')

//re-usable functions
var fetchNotes = () => {
  try {
    noteString = fs.readFileSync('notes-data.json')
    notes = JSON.parse(noteString)
    return notes
  } catch (e) {
    return []
  }
}

var saveNotes = (notes) => {
  fs.writeFileSync('notes-data.json', JSON.stringify(notes))
}

//arrow functions
addNote = (title, body) => {
  var notes = fetchNotes()
  var note = {
    title,
    body
  }

  //check for duplicates
  var duplicateNotes = notes.filter((note) => note.title === title )

  if (duplicateNotes.length === 0){
    notes.push(note)

    //writing notes into file
    saveNotes(notes)
    return note
  }
}

getAll = () => {
  return fetchNotes()
}

readNote = (title) => {
  //fetch notes
  notes = fetchNotes()
  //filter notes
  filteredNotes = notes.filter((note) => note.title === title)
  //return note
  return filteredNotes[0]
}

removeNote = (title) => {
  //fetch notes
  notes = fetchNotes()
  //filter note and remove the one with the same title
  toSaveNotes = notes.filter((note) => note.title !== title)
  //save notes
  saveNotes(toSaveNotes)

  return notes.length !== toSaveNotes.length
}

logNote =  (note) => {
  debugger
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
