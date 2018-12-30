const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  text: String,
  created_on: { type: Date, default: Date.now },
  delete_password: String,
  reported: { type: String, default: false }
})

const threadSchema = new mongoose.Schema({
  text: String,
  created_on: {type: Date, default: Date.now },
  bumped_on: {type: Date, default: Date.now },
  reported: {type: Boolean, default: false},
  delete_password: String,
  replies: [replySchema]
})

let now = new Date()

replySchema.pre('save', function(next) {
  if (!this.created_on) {
    this.created_on = now
  }
  next()
})

threadSchema.pre('save', function(next) {
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

  Board.createReply = function(threadId, text, password) {
    return this.findByIdAndUpdate(
      threadId,
      { $push: {
         replies: { 
          text: text,
          delete_password: password
          }
        },
        $set: {
          bumped_on: now
        }
      }
    )
  }

  return Board
}

module.exports = createBoard