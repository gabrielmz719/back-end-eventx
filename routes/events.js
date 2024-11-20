const express = require('express');
const router = express.Router();
const EventController = require('../controller/eventController');

// Rota para exibir todos os eventos (GET /events)
router.get('/', EventController.getAllEvents);

// Rota para criação de um novo evento (POST /events)
router.post('/', EventController.createEvent);

// Rota para exibir os detalhes de um evento específico (GET /events/:id)
router.get('/:id', EventController.getEventDetails);

// Rota para permitir que um usuário se registre para um evento (POST /events/:eventId/register)
router.post('/:eventId/register', EventController.registerForEvent);

// Rota para manipular a edição de evento (PUT /events/:id)
router.put('/:id', EventController.updateEvent);

// Rota para excluir um evento (DELETE /events/:id)
router.delete('/:id', EventController.deleteEvent);

// Rota para permitir que o usuário cancele o registro em um evento (POST /events/:eventId/unregister)
router.post('/:eventId/unregister', EventController.unregisterFromEvent);

module.exports = router;
