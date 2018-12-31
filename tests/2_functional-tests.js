/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let thread1_id
  let thread2_id
  let reply_id
  let pass = 'password1'
  let text1 = 'Should be deleted'
  let text2 = 'Should not be deleted'

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('', async() => {
        let post1 = chai.request(server)
          .post('/api/threads/test')
          .send({ text: text1, delete_password: pass})

        let post2 = chai.request(server)
          .post('/api/threads/test')
          .send({ text: text2, delete_password: pass})

        let [res1, res2] = await Promise.all([post1, post2])
        assert.equal(res1.status, 200)
        assert.equal(res2.status, 200)
      })

    });
    
    suite('GET', function() {
      
      test('The latest 10 threads with max 3 replies', async() => {
        let res = await chai.request(server)
          .get('/api/threads/test')

        assert.equal(res.status, 200)
        assert.isArray(res.body)
        assert.isBelow(res.body.length, 11)
        assert.notProperty(res.body[0], 'reported')
        assert.notProperty(res.body[0], 'delete_password')
        assert.isArray(res.body[0].replies)
        assert.isBelow(res.body[0].replies.length, 3)
        assert.property(res.body[0], '_id')
        assert.property(res.body[0], 'text')
        assert.property(res.body[0], 'created_on')
        assert.property(res.body[0], 'bumped_on')

        thread1_id = res.body[0]._id
        thread2_id = res.body[1]._id
      })
    });
    
    suite('DELETE', function() {
      
      test('correct password', async() => {

        let res = await chai.request(server)
          .delete('/api/threads/test')
          .send({
            thread_id: thread1_id,
            delete_password: pass
          })

        assert.equal(res.status, 200)
        assert.equal(res.text, 'success')
      })

      test('incorrect password', async() => {
        let res = await chai.request(server)
          .delete('/api/threads/test')
          .send({
            thread_id: thread2_id,
            delete_password: 'not_password'
          })

        assert.equal(res.status, 200)
        assert.equal(res.text, 'incorrect password')
      })
    });
    
    suite('PUT', function() {
      
      test('report thread', async() => {
        let res = await chai.request(server)
          .put('/api/threads/test')
          .send({ thread_id: thread2_id})

        assert.equal(res.status, 200)
        assert.equal(res.text, 'reported')
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('post reply to thread', async() => {
        let res = await chai.request(server)
          .post('/api/replies/test')
          .send({
            thread_id: thread2_id,
            text: 'A test reply',
            delete_password: pass
          })

        assert.equal(res.status, 200)
      })
    });
    
    suite('GET', function() {
      
      test('get entire thread', async() => {
        let res = await chai.request(server)
          .get('/api/replies/test')
          .query({ thread_id:  thread2_id })

        assert.equal(res.status, 200)
        assert.property(res.body, '_id')
        assert.property(res.body, 'text')
        assert.property(res.body, 'created_on')
        assert.property(res.body, 'bumped_on')
        assert.property(res.body, 'replies')
        assert.notProperty(res.body, 'reported')
        assert.notProperty(res.body, 'delete_password')
        assert.isArray(res.body.replies)
        let reply = res.body.replies[res.body.replies.length -1]
        reply_id = reply._id
        assert.property(reply, '_id')
        assert.property(reply, 'text')
        assert.property(reply, 'created_on')
        assert.notProperty(reply, 'reported')
        assert.notProperty(reply, 'deleted_password')
      })
    });
    
    suite('PUT', function() {
      
      test('report reply', async() => {
        let res = await chai.request(server)
          .put('/api/replies/test')
          .send({
            thread_id: thread2_id,
            reply_id: reply_id
          })

        assert.equal(res.status, 200)
        assert.equal(res.text, 'reported')
      })
    });
    
    suite('DELETE', function() {
      
      test('delete reply, incorrect password', async() => {
        let res = await chai.request(server)
          .delete('/api/replies/test')
          .send({
            thread_id: thread2_id,
            reply_id: reply_id,
            delete_password: 'some bad password',
          })

        assert.equal(res.status, 200)
        assert.equal(res.text, 'incorrect password')
      })

      test('delete reply, correct password', async() => {
        let res = await chai.request(server)
          .delete('/api/replies/test')
          .send({
            thread_id: thread2_id,
            reply_id: reply_id,
            delete_password: pass,
          })

        assert.equal(res.status, 200)
        assert.equal(res.text, 'success')
      })
    });
    
  });

});
