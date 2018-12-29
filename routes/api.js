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
      const Board = createBoard(req.params.board)
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
