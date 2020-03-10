//console.log('Starting note app')

//importing existing modules
const fs = require('fs')

//importing 3rd party modules
const _ = require('lodash')
const yargs = require('yargs')

//importing local custom modules
const notes = require('./notes')

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

let argv = yargs
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
let command = argv._[0]

if (command === 'add'){
  let note = notes.addNote(argv.title, argv.body)
  if(note){
    console.log(`${note.title} has been created`)
    notes.logNote(note)
  }else{
    console.log(`${argv.title} already exists`)
  }

}else if(command === 'list'){
  let allNotes = notes.getAll()
  console.log(`Printing ${allNotes.length} note(s)`)
  allNotes.forEach((note) => notes.logNote(note))

}else if(command === 'read'){
  let note = notes.readNote(argv.title)
  if (note){
    console.log(`Reading note - ${note.title}`)
    notes.logNote(note)
  }else{
    console.log(`${argv.title} was not found`)
  }
}else if(command === 'remove'){
  let status = notes.removeNote(argv.title)
  let msg = status ? 'Note was removed' : 'Note not found' //Ternary
  console.log(msg)
}else{
  console.log('Command not recognized')
}
