const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId

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
      threadId, {
        $push: {
        replies: { 
        text: text,
        delete_password: password
        }
      },
      $set: { bumped_on: now }
    })
  }

  Board.deleteThread = function(threadId, password) {

    return this.findOneAndDelete({
      _id: ObjectId(threadId),
      delete_password: password
    })
  }

  Board.deleteReply = function(threadId, replyId, password) {
    return this.findOneAndUpdate(
      {
        _id: ObjectId(threadId),
        'replies._id': replyId,
        'replies.delete_password': password
      },
      { $set: { 'replies.$.text': '[deleted]' }})
  }

  Board.reportThread = function(threadId) {
    return this.findByIdAndUpdate(
      threadId,
      { $set: { reported: true }}
    )
  }

  Board.reportReply = function(threadId, replyId) {
    return this.findOneAndUpdate(
      {
        _id: ObjectId(threadId),
        'replies._id': replyId
      },
      { $set: { 'replies.$.reported': true }}
    )
  }

  Board.returnEntireThread = function(threadId) {
    return this.findById(
      threadId,
      { 
        reported: 0,
        delete_password: 0,
        'replies.reported': 0,
        'replies.delete_password': 0
      }
    )
  }

  Board.returnRecent = function() {
    return this.aggregate(
      [
        { $match: {}},
        { $sort: { bumped_on: -1 }},
        { $limit: 10 },
        { $project: {
          delete_password:0,
          reported: 0,
          replies: {
            delete_password: 0,
            reported: 0
          }
        }}
      ]
    )
  }

  return Board
}

module.exports = createBoard