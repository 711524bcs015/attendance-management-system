const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createAttendance, getAttendance, getAttendanceByStudent, getAttendanceBySubject, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, allowRoles('faculty'), [
	body('student').notEmpty().withMessage('student required'),
	body('subject').notEmpty().withMessage('subject required'),
	body('date').notEmpty().withMessage('date required'),
	body('status').isIn(['Present','Absent']).withMessage('status must be Present or Absent')
], createAttendance);
router.get('/', protect, allowRoles('admin', 'faculty'), getAttendance);
router.get('/student/:studentId', protect, allowRoles('admin', 'faculty', 'student'), getAttendanceByStudent);
router.get('/subject/:subjectId', protect, allowRoles('admin', 'faculty'), getAttendanceBySubject);
router.put('/:id', protect, allowRoles('faculty', 'admin'), updateAttendance);
router.delete('/:id', protect, allowRoles('admin'), deleteAttendance);

module.exports = router;
