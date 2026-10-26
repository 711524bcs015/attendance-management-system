const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createFaculty, getFaculty, getFacultyById, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, allowRoles('admin'), getFaculty);
router.post('/', protect, allowRoles('admin'), [
	body('facultyId').notEmpty().withMessage('facultyId required'),
	body('name').notEmpty().withMessage('name required'),
	body('email').isEmail().withMessage('Valid email required')
], createFaculty);
router.get('/:id', protect, allowRoles('admin', 'faculty'), getFacultyById);
router.put('/:id', protect, allowRoles('admin'), updateFaculty);
router.delete('/:id', protect, allowRoles('admin'), deleteFaculty);

module.exports = router;
