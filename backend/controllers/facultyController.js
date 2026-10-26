const { validationResult } = require('express-validator');
const Faculty = require('../models/Faculty');
const User = require('../models/User');

const createFaculty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { facultyId, name, email, phone, department, subjects, password } = req.body;
    const existing = await Faculty.findOne({ $or: [{ facultyId }, { email }] });
    if (existing) return res.status(409).json({ success: false, message: 'Faculty with ID or email already exists' });
    const user = await User.create({ name, email, password: password || 'Faculty@123', role: 'faculty' });
    const faculty = await Faculty.create({ userId: user._id, facultyId, name, email, phone, department, subjects });
    res.status(201).json({ success: true, message: 'Faculty created', data: faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().populate('department subjects');
    res.json({ success: true, data: faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id).populate('department subjects');
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, data: faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    Object.assign(faculty, req.body);
    await faculty.save();
    res.json({ success: true, message: 'Faculty updated', data: faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    await User.findByIdAndDelete(faculty.userId);
    await faculty.remove();
    res.json({ success: true, message: 'Faculty removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createFaculty, getFaculty, getFacultyById, updateFaculty, deleteFaculty };
