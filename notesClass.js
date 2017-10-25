'use strict';
class Note {
    constructor(key, title, body) {
        this.key = key;
        this.title = title;
        this.body = body;
    }
}

const notes = [];

// Create a Note, the C or CRUD
const createNote = (key, title, body) => {
    notes[key] = new Note(key, title, body);
};

// Read a Note, the R of CRUD
const readNote = (key) => {
    return notes[key];
};

// Update a Note, the U of CRUD
const updateNote = createNote;

// Destroy (delete) a Note, the D of CRUD
const destroyNote = (key) => {
    delete notes[key];
};

const noteKeys = () => {
    return Object.keys(notes);
};

createNote('foo', 'Foo', `This is Foo's Body`);
createNote('bar', 'Bar', `This is Bar's Body`);

console.log(notes);
console.log(noteKeys());





