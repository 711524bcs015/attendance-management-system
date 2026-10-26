const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createStudent, getStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, allowRoles('admin', 'faculty'), getStudents);
router.post('/', protect, allowRoles('admin'), [
	body('studentId').notEmpty().withMessage('studentId required'),
	body('name').notEmpty().withMessage('name required'),
	body('email').isEmail().withMessage('Valid email required')
], createStudent);
router.get('/:id', protect, allowRoles('admin', 'faculty', 'student'), getStudentById);
router.put('/:id', protect, allowRoles('admin'), updateStudent);
router.delete('/:id', protect, allowRoles('admin'), deleteStudent);

module.exports = router;
