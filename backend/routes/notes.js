const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


// Route 1:  get all the notes using :get "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
     }
});

// Route 2: Add Notes using :Post "/api/notes/addnote"
router.post('/addnote', fetchuser, [

    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'enter a valid description').isLength({ min: 5 }),
], async (req, res) => {
try {
    const { title, description, tag } = req.body;
    //if there are errors , return Bad Request & the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
        title, description, tag, user: req.user.id
    })
  const SavedNotes =  await note.save()
    res.json(SavedNotes);
}  catch (error) {
    console.error(error.message)
    res.status(500).send("some error occured");
 }
   
})

// Route 3: update the notes using :put "/api/notes/updatenote"
router.put('/updatenote/:id', fetchuser,async (req, res) => {
    const { title, description, tag } = req.body;
    try {
            //create now not object
    const newNote = {};
    if(title){
        newNote.title = title;
    }
    if(description){
        newNote.description = description;
    }
    if(tag){
        newNote.tag = tag;
    }

    //find the note to be update and update it
    // const note  = Note.findByIdAndUpdate()
    let note  = await Note.findById(req.params.id);
    if(!note){
     return   res.status(404).send("Not Found")
    }
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json(note);
    }catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
     }
       

});


// Route 4: delete the notes using :delete "/api/notes/updatenote"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
try {

     //find the note to be deleted and delete it
    // const note  = Note.findByIdAndUpdate()
    let note  = await Note.findById(req.params.id);
    if(!note){
     return   res.status(404).send("Not Found")
    }

    //allow deletion only if owns this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"success": req.params.title + " Note has been deleted", note: note});
    
} catch (error) {
    console.error(error.message)
    res.status(500).send("some error occured");
 }

   
});
module.exports = router;
