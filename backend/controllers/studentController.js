const { validationResult } = require('express-validator');
const Student = require('../models/Student');
const User = require('../models/User');

const createStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { studentId, name, email, phone, department, year, semester, section, password } = req.body;
    const existingStudent = await Student.findOne({ $or: [{ studentId }, { email }] });
    if (existingStudent) return res.status(409).json({ success: false, message: 'Student with ID or email already exists' });
    // create user account
    const user = await User.create({ name, email, password: password || 'Student@123', role: 'student' });
    const student = await Student.create({ userId: user._id, studentId, name, email, phone, department, year, semester, section });
    res.status(201).json({ success: true, message: 'Student created', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, department } = req.query;
    const query = {};
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { studentId: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    if (department) query.department = department;
    const students = await Student.find(query).skip((page - 1) * limit).limit(parseInt(limit)).populate('department');
    const total = await Student.countDocuments(query);
    res.json({ success: true, data: { students, total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('department');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    Object.assign(student, req.body);
    await student.save();
    res.json({ success: true, message: 'Student updated', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    await User.findByIdAndDelete(student.userId);
    await student.remove();
    res.json({ success: true, message: 'Student removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };
