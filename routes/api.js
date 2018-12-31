/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const createBoard = require('../models/thread')

module.exports = function (app) {
  
  app.route('/api/threads/:board')

    .post(async (req, res) => {
      const { board } = req.params
      const { text, delete_password } = req.body
      const Board = createBoard(board)

      try{await Board.createThread(text, delete_password)}
      catch(err){ 
        console.error(`Failed to post thread to ${board}`) 
        res.send('Error occurred while saving thread')
      }
      res.redirect(`/b/${board}`)
    })

    .get(async (req, res) => {
      const Board = createBoard(req.params.board)
      let trimmed
      try{ 
        let response = await Board.returnRecent()
        trimmed = response.map(thread => {
          return {
            _id: thread._id,
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: thread.replies.slice(thread.replies.length -3)
          }
        })
      }
      catch(err){
        console.error('failed to get recent threads')
        res.send('unable to get threads')
      }
      res.json(trimmed)
    })

    .delete(async (req, res) => {
      const { board } = req.params
      const { thread_id, delete_password } = req.body
      const Board = createBoard(board)

      try{ await Board.deleteThread(thread_id, delete_password)}
      catch(err){ 
        console.error(`failed to delete thread id: ${thread_id}`)
        res.send('incorrect password')
      }
      res.send('success')
    })

    .put(async (req, res) => {
      const { board } = req.params
      const { thread_id } = req.body
      const Board = createBoard(board)

      try{ await Board.reportThread(thread_id)}
      catch(err){ 
        console.error(`failed to report thread id: ${thread_id}`)
        res.send('failed to report')
      }
      res.send('success')
    })
  
  //=================================================================

  app.route('/api/replies/:board')

    .post(async (req, res) => {
      const { board } = req.params
      const { text, delete_password, thread_id } = req.body
      const Board = createBoard(board)

      try{ await Board.createReply(thread_id, text, delete_password) }
      catch(err){
        console.error(`Failed to post reply to ${board}`) 
        res.send('Error occurred while saving reply')
      }
      res.redirect(`/b/${board}`)
    })

    .get(async (req, res) => {
      const { board } = req.params
      const { thread_id } = req.query
      const Board = createBoard(board)
      let response

      try{ response = await Board.returnEntireThread(thread_id)}
      catch(err){
        console.error('failed to find thread')
        res.send('invalid id')
      }
      res.json(response)
    })

    .delete(async (req, res) => {
      const { board } = req.params
      const { thread_id, reply_id, delete_password } = req.body
      const Board = createBoard(board)

      try{ await Board.deleteReply(thread_id, reply_id, delete_password)}
      catch(err){ 
        console.error(`failed to delete reply id: ${reply_id}`)
        res.send('incorrect password')
      }
      res.send('success')
    })

    .put(async (req, res) => {
      const { board } = req.params
      const { thread_id, reply_id } = req.body
      const Board = createBoard(board)

      try{ await Board.reportReply(thread_id, reply_id)}
      catch(err){ 
        console.error(`failed to report reply id: ${reply_id}`)
        res.send('failed to report reply')
      }
      res.send('success')
    })

};
