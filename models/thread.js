const mongoose = require('mongoose')

const threadSchema = new mongoose.Schema({
    text: String,
    created_on: {type: Date, default: Date.now },
    bumped_on: {type: Date, default: Date.now },
    reported: {type: Boolean, default: false},
    delete_password: String,
    replies: [String]
})

threadSchema.pre('save', next => {
    let now = new Date();
    this.bumped_on = now;
    if (!this.created_on) {
        this.created_on = now
    }
    next()
})

const createBoard = (boardName) => {
    const Board = mongoose.model('board', threadSchema, boardName)

    //Methods
    Board.createThread = function(text, password) {
        return this.create({
            text: text,
            delete_password: password,
        })
    }

    return Board
}

module.exports = createBoard