const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, allowRoles('admin', 'faculty'), getDepartments);
router.post('/', protect, allowRoles('admin'), [
	body('name').notEmpty().withMessage('name required'),
	body('code').notEmpty().withMessage('code required')
], createDepartment);
router.put('/:id', protect, allowRoles('admin'), updateDepartment);
router.delete('/:id', protect, allowRoles('admin'), deleteDepartment);

module.exports = router;
