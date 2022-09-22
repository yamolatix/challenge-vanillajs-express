/* eslint-disable no-unused-expressions */

var supertest = require('supertest-as-promised')(require('../app'));
var expect = require('chai').expect;
var todos = require('../models/todos');


describe('Todo routes', function() {

  beforeEach(function() {
    todos.reset();
  });

  describe('`/users` URI', function() {
    xit('GET responde con un array vacío de entrada', function() {
      // cuando hacemos un request a `/users` recibimos un arreglo vacio
      return supertest // supertest nos permite hacer y testear requests HTTP
        .get('/users') // hacemos un request HTTP: GET a '/users'
        .expect(200) // el codigo de status del response
        .expect('Content-Type', /json/) // podemos testear los headers
        .expect(function(res) {
          expect(res.body).to.eql([]); // testeamos la respuesta con el body
        });
    });

    xit('GET responde con una persona después de que se agrega una tarea', function() {
      todos.add('toni', { content: 'comprar mogul' });
      return supertest
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.eql(['toni']);
        });
    });

    xit('GET responde con todo el que tenga una tarea', function() {
      todos.add('santi', { content: 'comprar medialunas' });
      todos.add('guille', { content: 'hacer un chivito' });
      todos.add('facu', { content: 'comprar caramelos' });
      return supertest
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.eql(['santi', 'guille', 'facu']);
        });
    });

  });

  describe('`/users/:name/tasks` URI', function() {

    xit('GET devuelve una lista con las tareas de cierto usuario', function() {
      todos.add('pinky', { content: '1er tarea de pinky' });
      todos.add('alan', { content: '1er tarea de alan', complete: true });
      todos.add('alan', { content: '2da tarea de alan' });
      return supertest
        .get('/users/alan/tasks')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.have.length(2);
          expect(res.body[0].content).to.equal('1er tarea de alan');
          expect(res.body[0].complete).to.be.true;
          expect(res.body[1].content).to.equal('2da tarea de alan');
          expect(res.body[1].complete).to.be.false;
        });
    });

    xit('POST crea una nueva tarea para ese usuario y devuelve dicha tarea', function() {
      return supertest
        .post('/users/doge/tasks')
        .send({ content: 'tarea de doge'}) // el body del request HTTP
        .expect(201) // van a tener que asignar ese status ustedes mismos
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.eql({
            content: 'tarea de doge',
            complete: false
          });
          expect(todos.list('doge')).to.have.length(1);
          expect(todos.list('doge')[0]).to.eql({
            content: 'tarea de doge',
            complete: false
          });
        });
    });

    xit('POST respeta el estado pre establecido para la tarea', function() {
      return supertest
        .post('/users/toni/tasks')
        .send({ content: 'traer milanesa tucumana', complete: true}) // el body del request
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.eql({
            content: 'traer milanesa tucumana',
            complete: true
          });
          expect(todos.list('toni')).to.have.length(1);
          expect(todos.list('toni')[0]).to.eql({
            content: 'traer milanesa tucumana',
            complete: true
          });
        });
    });

    describe('filtro de query (?key=value)', function () {

      beforeEach(function () {
        todos.add('solano', { content: 'aprender que tiene req.query' });
        todos.complete('solano', 0);
        todos.add('solano', { content: 'habilitar request para tareas especificas' });
      });

      xit('GET puede pedir solo las tareas completas', function () {
        return supertest
          .get('/users/solano/tasks?status=complete')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function(res) {
            expect(res.body).to.have.length(1); // devuelve solo 1 tarea
            expect(res.body[0].content).to.equal('aprender que tiene req.query'); // y es la tarea completada
          });
      });

      xit('GET podemos pedir solo las tareas activas (incompletas)', function () {
        return supertest
          .get('/users/solano/tasks?status=active')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(function(res) {
            expect(res.body).to.have.length(1); // también trae solo 1
            expect(res.body[0].content).to.equal('habilitar request para tareas especificas'); // y es la tarea activa
          });
      });
    });

    describe('`/:index` URI', function() {

      xit('PUT asigna una tarea como completa', function() {
        todos.add('santi', { content: 't0' });
        todos.add('santi', { content: 't1' });
        todos.add('santi', { content: 't2' });

        return supertest
          .put('/users/santi/tasks/1') // indica con el indice a que tarea apunto
          .expect(200)
          .expect(function() {
            expect(todos.list('santi')[0].complete).to.be.false;
            expect(todos.list('santi')[1].complete).to.be.true; // y se completa
            expect(todos.list('santi')[2].complete).to.be.false;
          });
      });

      xit('DELETE borra una tarea', function() {
        todos.add('guille', { content: 'dar lecture' });
        todos.add('guille', { content: 'ayudar con el workshop' });
        todos.add('guille', { content: 'hacer el review' });

        return supertest
          .delete('/users/guille/tasks/1')
          .expect(204)
          .expect(function() {
            expect(todos.list('guille')).to.have.length(2);
            expect(todos.list('guille')[0].content).to.equal('dar lecture');
            expect(todos.list('guille')[1].content).to.equal('hacer el review');
          });
      });
    });

    describe('manejo de errores', function() {

      xit('responde con status 404 si el usuaio no existe', function () {
        return supertest
          .get('/users/messi/tasks')
          .expect(404);
      });

      xit('responde con status 400 si se trata de agregar una tarea con propiedades erroneas', function () {
        return supertest
          .post('/users/bob/tasks')
          .send({
            content: '`content` es una propiedad valida',
            wrong: '`wrong` no es ninguna de las que esperábamos'
          })
          .expect(400);
      });

    });
  });
 });
