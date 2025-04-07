const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/tasks.controller');

router.use(auth);

router.post('/', controller.createTask);
router.get('/', controller.getAllTasks);
router.get('/:id', controller.getOneTask);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;
