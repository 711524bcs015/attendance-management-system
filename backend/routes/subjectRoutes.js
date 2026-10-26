const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createSubject, getSubjects, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, allowRoles('admin', 'faculty'), getSubjects);
router.post('/', protect, allowRoles('admin'), [
	body('subjectCode').notEmpty().withMessage('subjectCode required'),
	body('subjectName').notEmpty().withMessage('subjectName required')
], createSubject);
router.put('/:id', protect, allowRoles('admin'), updateSubject);
router.delete('/:id', protect, allowRoles('admin'), deleteSubject);

module.exports = router;
