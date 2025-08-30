const Note = require('../Models/Note.molel');
const asyncWrapper = require('../Middlewares/asyncWrapper');
const Status = require('../Utils/Status');
const Rate = require('../Models/Rate.model');
const AppError = require('../Utils/AppError')


const addNote = asyncWrapper(async (req, res, next) => {
    const { course, description, classNum } = req.body;
    const filePath = req.file.path;
    const user = req.user;
    const newNote = new Note({ course, description, classNum, filePath, studentId: user.id });
    await newNote.save();
    res.json({ NewNote: newNote });
})
const getAllNotes = asyncWrapper(async (req, res, next) => {
    const notes = await Note.find({}, { __v: false });
    res.json({ Status: Status.SUCCESS, Notes: notes });
})
const rateThis = asyncWrapper(async (req, res, next) => {
    const noteId = req.params.noteId;

    const deleted = await Rate.findOneAndDelete({ noteId, raterId: req.user.id });


    const note = await Note.findById(noteId);

    if (!note) {
        return next(new AppError('Note not found', 404, Status.FAIL));
    }

    if (!deleted) {
        note.ratesNum++;
        await note.save();
    }


    const { rate } = req.body;
    const newRate = new Rate({
        rate,
        raterId: req.user.id,
        noteId
    });
    await newRate.save();


    const rates = await Rate.find({ noteId });

    let sum = 0;
    for (let i = 0; i < rates.length; i++) {
        sum += rates[i].rate;
    }
    const result = sum / rates.length;

    note.rate = result;
    await note.save();

    res.json({
        Status: Status.SUCCESS,
        Rate: rate
    });
});
const isRated = asyncWrapper(async (req, res, next) => {
    const noteId = req.params.noteId;
    const rate = await Rate.find({noteId , raterId:req.user.id});
    if(rate.length>0)
        return res.json({Status:Status.SUCCESS , isRated:true , Rate:rate })
    else
        return res.json({Status:Status.SUCCESS , isRated:false , Rate:null})
});


module.exports = { addNote, getAllNotes, rateThis  , isRated };


