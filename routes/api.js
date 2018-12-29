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
      res.send('Hello')
    })

    .delete(async (req, res) => {
      const Board = createBoard(req.params.board)
    })

    .put(async (req, res) => {
      const Board = createBoard(req.params.board)
    })
    
  app.route('/api/replies/:board')

    .post(async (req, res) => {
      const Board = createBoard(req.params.board)
    })

    .get(async (req, res) => {
      const Board = createBoard(req.params.board)
    })

    .delete(async (req, res) => {
      const Board = createBoard(req.params.board)
    })

    .put(async (req, res) => {
      const Board = createBoard(req.params.board)
    })

};
