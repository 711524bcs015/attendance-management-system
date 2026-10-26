const { validationResult } = require('express-validator');
const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');

const createSubject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { subjectCode, subjectName, department, semester, faculty } = req.body;
    const existing = await Subject.findOne({ $or: [{ subjectCode }, { subjectName }] });
    if (existing) return res.status(409).json({ success: false, message: 'Subject already exists' });
    const subject = await Subject.create({ subjectCode, subjectName, department, semester, faculty });
    if (faculty) {
      await Faculty.findByIdAndUpdate(faculty, { $addToSet: { subjects: subject._id } });
    }
    res.status(201).json({ success: true, message: 'Subject created', data: subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    let query = {};
    if (req.user?.role === 'faculty') {
      const facultyRecord = await Faculty.findOne({ userId: req.user._id });
      if (!facultyRecord) return res.json({ success: true, data: [] });
      query = { faculty: facultyRecord._id };
    }
    const subjects = await Subject.find(query).populate('department faculty');
    res.json({ success: true, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    Object.assign(subject, req.body);
    await subject.save();
    res.json({ success: true, message: 'Subject updated', data: subject });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    await subject.remove();
    res.json({ success: true, message: 'Subject removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createSubject, getSubjects, updateSubject, deleteSubject };
