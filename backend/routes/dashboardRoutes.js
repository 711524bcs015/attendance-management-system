const express = require('express');
const router = express.Router();
const { adminDashboard, facultyDashboard, studentDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/admin', protect, allowRoles('admin'), adminDashboard);
router.get('/faculty', protect, allowRoles('faculty'), facultyDashboard);
router.get('/student', protect, allowRoles('student'), studentDashboard);

module.exports = router;
