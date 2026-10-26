const { validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');

const createAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { student, subject, faculty: facultyFromBody, date, status, remarks } = req.body;
    let faculty = facultyFromBody;
    // If faculty not provided, and request is from an authenticated faculty, find faculty record
    if (!faculty && req.user) {
      const facultyRecord = await Faculty.findOne({ userId: req.user._id });
      if (facultyRecord) faculty = facultyRecord._id;
    }
    if (!faculty) return res.status(400).json({ success: false, message: 'Faculty is required' });
    if (req.user?.role === 'faculty') {
      const facultyRecord = await Faculty.findOne({ userId: req.user._id });
      const assigned = facultyRecord && await Subject.exists({ _id: subject, faculty: facultyRecord._id });
      if (!assigned) return res.status(403).json({ success: false, message: 'You can only mark attendance for your assigned subjects' });
    }
    const attendanceDate = new Date(date);
    const exists = await Attendance.findOne({ student, subject, date: attendanceDate });
    if (exists) return res.status(409).json({ success: false, message: 'Attendance already exists for this student/subject/date' });
    const att = await Attendance.create({ student, subject, faculty, date: attendanceDate, status, remarks });
    res.status(201).json({ success: true, message: 'Attendance saved', data: att });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 50, student, subject, date, status } = req.query;
    const query = {};
    if (student) query.student = student;
    if (subject) query.subject = subject;
    if (status) query.status = status;
    if (date) query.date = new Date(date);
    const data = await Attendance.find(query).populate('student subject faculty').skip((page - 1) * limit).limit(parseInt(limit)).sort({ date: -1 });
    const total = await Attendance.countDocuments(query);
    res.json({ success: true, data: { records: data, total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAttendanceByStudent = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId }).populate('subject faculty').sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAttendanceBySubject = async (req, res) => {
  try {
    const records = await Attendance.find({ subject: req.params.subjectId }).populate('student faculty').sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const att = await Attendance.findById(req.params.id);
    if (!att) return res.status(404).json({ success: false, message: 'Attendance not found' });
    Object.assign(att, req.body);
    await att.save();
    res.json({ success: true, message: 'Attendance updated', data: att });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'Duplicate attendance' });
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const att = await Attendance.findById(req.params.id);
    if (!att) return res.status(404).json({ success: false, message: 'Attendance not found' });
    await att.remove();
    res.json({ success: true, message: 'Attendance removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createAttendance, getAttendance, getAttendanceByStudent, getAttendanceBySubject, updateAttendance, deleteAttendance };
