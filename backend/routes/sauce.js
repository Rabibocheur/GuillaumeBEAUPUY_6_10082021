const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceController = require('../controllers/sauce');

router.get('/', sauceController.getAllSauce);
router.post('/', auth, multer, sauceController.createSauce);
router.get('/:id', sauceController.getOneSauce);

module.exports = router;
