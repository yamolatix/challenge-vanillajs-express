var expect = require('chai').expect;

var Todos = require('../models/todos');
describe('To do model', function() {

  beforeEach(function() {
    Todos.reset();
  });

  describe('`listPeople` y `add`', function() {
    it('inicialmente devuelve un arreglo vacío', function() {
      expect(Todos.listPeople()).to.eql([]);
    });

    it('agrega personas a la lista una vez que se les asignan tareas', function() {
      Todos.add('guille', { content: 'limpiar su cuarto' });
      expect(Todos.listPeople()).to.eql(['guille']);
    });

    it('maneja distintas personas con distintas tareas', function(){
      Todos.add('toni', { content: 'limpiar su cuarto' });
      Todos.add('toni', { content: 'comprar pan' });
      expect(Todos.listPeople()).to.eql(['toni']);
      Todos.add('santi', { content: 'hacer empanadas' });
      expect(Todos.listPeople()).to.eql(['toni', 'santi']);
    });
  });

  describe('`add` y `list`', function() {
    it('recuerda quien hace que', function() {
      Todos.add('facu', { content: 'limpiar el baño' });
      expect(Todos.list('facu')).to.have.length(1);
      Todos.add('guille', { content: 'comprar chocolate' });
      expect(Todos.list('guille')).to.have.length(1);
      Todos.add('guille', { content: 'limpiar la cocina' });
      expect(Todos.list('guille')).to.have.length(2);
    });
  });

  describe('`complete`', function() {
    it('la propiedad `complete` es un booleano que ponemos como `false`\
      cada vez que ingresa una nueva tarea', function() {
      Todos.add('santi', { content: 'bañarse' });
      expect(Todos.list('santi')[0].complete).to.be.false;
    });

    it('respeta un estado pre establecido para la tarea', function() {
      Todos.add('toni', { content: 'hacer cafe', complete: true });
      Todos.add('toni', { content: 'dejar de fumar', complete: false });
      expect(Todos.list('toni')[0].complete).to.be.true;
      expect(Todos.list('toni')[1].complete).to.be.false;
    });

    it("el método `complete` cambia el estado de la tarea a completado (`true`)", function() {
      Todos.add('santi', { content: 'ir al chino' });
      Todos.add('santi', { content: 'ir al kiosko' });
      Todos.add('santi', { content: 'limpiar la maquinita' });
      Todos.complete('santi', 1);
      expect(Todos.list('santi')[0].complete).to.be.false;
      expect(Todos.list('santi')[1].complete).to.be.true;
      expect(Todos.list('santi')[2].complete).to.be.false;
    });
  });

  describe('`remove`', function() {
    it('remueve una tarea de una persona por indice', function() {
      for (var i = 0; i < 10; i++) Todos.add('guille', { content: 'tarea ' + i });
      expect(Todos.list('guille').length).to.equal(10);
      Todos.remove('guille', 5);
      expect(Todos.list('guille').length).to.equal(9);
      expect(Todos.list('guille')[4].content).to.equal('tarea 4');
      expect(Todos.list('guille')[5].content).to.equal('tarea 6');
      expect(Todos.list('guille')[6].content).to.equal('tarea 7');
    });
  });
});
