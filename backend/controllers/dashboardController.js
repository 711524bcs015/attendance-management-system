const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');

const adminDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1);
    const todaysAttendance = await Attendance.find({ date: { $gte: today, $lt: tomorrow } });
    const presentCount = todaysAttendance.filter(a => a.status === 'Present').length;
    const absentCount = todaysAttendance.filter(a => a.status === 'Absent').length;
    // average attendance across subjects (simplified)
    const totalRecords = await Attendance.countDocuments();
    const presentTotal = await Attendance.countDocuments({ status: 'Present' });
    const averageAttendance = totalRecords ? (presentTotal / totalRecords) * 100 : 0;

    // Attendance overview last 7 days
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      const nd = new Date(d);
      nd.setDate(nd.getDate() + 1);
      const recs = await Attendance.find({ date: { $gte: d, $lt: nd } });
      last7.push({ date: d.toISOString().slice(0,10), present: recs.filter(r => r.status === 'Present').length, absent: recs.filter(r => r.status === 'Absent').length });
    }

    // Department-wise student counts
    const deptAgg = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    // populate department names
    const deptCounts = [];
    for (const d of deptAgg) {
      const dept = await require('../models/Department').findById(d._id);
      deptCounts.push({ department: dept ? dept.name : 'Unknown', count: d.count });
    }

    // Attendance statistics (present vs absent)
    const stats = [
      { name: 'Present', value: presentTotal },
      { name: 'Absent', value: totalRecords - presentTotal }
    ];

    res.json({ success: true, data: { totalStudents, totalFaculty, totalSubjects, todaysAttendance: todaysAttendance.length, presentCount, absentCount, averageAttendance: Number(averageAttendance.toFixed(2)), attendanceOverview: last7, departmentStudents: deptCounts, attendanceStats: stats } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const facultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user._id;
    const faculty = await Faculty.findOne({ userId: facultyId }).populate('subjects');
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty profile not found' });
    // today's attendance counts for this faculty
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1);
    const todaysAttendance = await Attendance.find({ faculty: faculty._id, date: { $gte: today, $lt: tomorrow } });
    const presentCount = todaysAttendance.filter(a => a.status === 'Present').length;
    const absentCount = todaysAttendance.filter(a => a.status === 'Absent').length;
    res.json({ success: true, data: { facultyName: faculty.name, subjects: faculty.subjects, todaysAttendance: todaysAttendance.length, presentCount, absentCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const studentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const student = await Student.findOne({ userId }).populate('department');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const records = await Attendance.find({ student: student._id });
    const present = records.filter(r => r.status === 'Present').length;
    const total = records.length;
    const percentage = total ? (present / total) * 100 : 0;
    res.json({ success: true, data: { student, present, total, percentage: Number(percentage.toFixed(2)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { adminDashboard, facultyDashboard, studentDashboard };
