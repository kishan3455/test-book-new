const express = require("express");

const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const { findByIdAndUpdate } = require("../models/User");

// route:1 get all notes using :Get "/api/notes/getuser" .login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error");
  }
});
// route:2 add new note using :Post "/api/notes/addnote" .login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atlest 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, teg } = req.body;
      //if there are errors,return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        teg,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal server error");
    }
  }
);
// route:3 update and existing note using :Put "/api/notes/updatenote" .login required
router.post("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, teg } = req.body;
  try {
    //create new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (teg) {
      newNote.teg = teg;
    }

    //find note to be update and upadate it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error");
  }
});
// route:4 delete and existing note using : Delete "/api/notes/deletenote" .login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, teg } = req.body;
  try {
    //find note to be delete and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    //Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "note be deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error");
  }
});
module.exports = router;
