
const { validationResult } = require('express-validator');
const Department = require('../models/Department');

const createDepartment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
    const { name, code, description } = req.body;
    const existing = await Department.findOne({ $or: [{ name }, { code }] });
    if (existing) return res.status(409).json({ success: false, message: 'Department already exists' });
    const dept = await Department.create({ name, code, description });
    res.status(201).json({ success: true, message: 'Department created', data: dept });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDepartments = async (req, res) => {
  try {
    const depts = await Department.find();
    res.json({ success: true, data: depts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    Object.assign(dept, req.body);
    await dept.save();
    res.json({ success: true, message: 'Department updated', data: dept });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found' });
    await dept.remove();
    res.json({ success: true, message: 'Department removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createDepartment, getDepartments, updateDepartment, deleteDepartment };
