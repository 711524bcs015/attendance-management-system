const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.post('/register', [
	body('name').notEmpty().withMessage('Name is required'),
	body('email').isEmail().withMessage('Valid email required'),
	body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
	body('role').isIn(['student', 'faculty']).withMessage('Role must be student or faculty')
], register);

router.post('/login', [
	body('email').isEmail().withMessage('Valid email required'),
	body('password').notEmpty().withMessage('Password required')
], login);

router.get('/me', protect, me);

module.exports = router;
