//console.log('Starting note app')

//importing existing modules
const fs = require('fs')

//importing 3rd party modules
const _ = require('lodash')
const yargs = require('yargs')

//importing local custom modules
const notes = require('./notes.js')

const titleOptions = {
                      describe: 'Title of the note',
                      demand: true,
                      alias: 't'
                    }
const bodyOptions = {
                    describe: 'Body of the note',
                    demand: true,
                    alias: 'b'
                  }

var argv = yargs
  .command('add', 'Add a new note', {
    title: titleOptions,
    body: bodyOptions,
  })
  .command('list', 'List all notes')
  .command('read', 'Read a note', {
    title: titleOptions
  })
  .command('remove', 'Remove a note', {
    title: titleOptions
  })

  .help()
  .argv
var command = argv._[0]

if (command === 'add'){
  var note = notes.addNote(argv.title, argv.body)
  if(note){
    console.log(`${note.title} has been created`)
    logNote(note)
  }else{
    console.log(`${argv.title} already exists`)
  }

}else if(command === 'list'){
  var allNotes = notes.getAll()
  console.log(`Printing ${allNotes.length} note(s)`)
  allNotes.forEach((note) => logNote(note))

}else if(command === 'read'){
  var note = notes.readNote(argv.title)
  if (note){
    console.log(`Reading note - ${note.title}`)
    logNote(note)
  }else{
    console.log(`${argv.title} was not found`)
  }
}else if(command === 'remove'){
  var status = notes.removeNote(argv.title)
  var msg = status ? 'Note was removed' : 'Note not found' //Ternary
  console.log(msg)
}else{
  console.log('Command not recognized')
}
