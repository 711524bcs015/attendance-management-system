const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const Department = require('../models/Department');
const Attendance = require('../models/Attendance');

const seed = async () => {
  try {
    await connectDB();
    // Clear existing
    await Attendance.deleteMany();
    await Student.deleteMany();
    await Faculty.deleteMany();
    await Subject.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();

    // Departments
    const depts = await Department.insertMany([
      { name: 'Computer Science', code: 'CSE' },
      { name: 'Electrical', code: 'EEE' }
    ]);

    // Admin user
    const admin = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'Admin@123', role: 'admin' });

    // Faculty
    const f1User = await User.create({ name: 'Dr. Alice', email: 'alice@example.com', password: 'Faculty@123', role: 'faculty' });
    const f2User = await User.create({ name: 'Dr. Bob', email: 'bob@example.com', password: 'Faculty@123', role: 'faculty' });
    const f1 = await Faculty.create({ userId: f1User._id, facultyId: 'F1001', name: 'Dr. Alice', email: 'alice@example.com', department: depts[0]._id });
    const f2 = await Faculty.create({ userId: f2User._id, facultyId: 'F1002', name: 'Dr. Bob', email: 'bob@example.com', department: depts[1]._id });

    // Subjects
    const subjects = await Subject.insertMany([
      { subjectCode: 'CS101', subjectName: 'Introduction to Programming', department: depts[0]._id, semester: 1, faculty: f1._id },
      { subjectCode: 'CS102', subjectName: 'Data Structures', department: depts[0]._id, semester: 2, faculty: f1._id },
      { subjectCode: 'EE101', subjectName: 'Circuit Theory', department: depts[1]._id, semester: 1, faculty: f2._id },
      { subjectCode: 'EE102', subjectName: 'Signals', department: depts[1]._id, semester: 2, faculty: f2._id },
      { subjectCode: 'CS201', subjectName: 'Databases', department: depts[0]._id, semester: 3, faculty: f1._id }
    ]);

    // Update faculty subjects
    await Faculty.findByIdAndUpdate(f1._id, { $set: { subjects: subjects.filter(s => s.faculty.toString() === f1._id.toString()).map(s => s._id) } });
    await Faculty.findByIdAndUpdate(f2._id, { $set: { subjects: subjects.filter(s => s.faculty.toString() === f2._id.toString()).map(s => s._id) } });

    // Students
    const studentsData = [];
    for (let i = 1; i <= 10; i++) {
      const num = 1000 + i;
      const email = `student${i}@example.com`;
      const user = await User.create({ name: `Student ${i}`, email, password: 'Student@123', role: 'student' });
      const student = { userId: user._id, studentId: `S${num}`, name: `Student ${i}`, email, department: depts[0]._id, year: 1, semester: 1, section: 'A' };
      studentsData.push(student);
    }
    const students = await Student.insertMany(studentsData);

    // Attendance sample: mark random attendance for last 10 days
    const attendanceRecords = [];
    const subjectsPool = subjects;
    for (let d = 0; d < 10; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      for (const student of students) {
        const subj = subjectsPool[Math.floor(Math.random() * subjectsPool.length)];
        const facultyForSubj = subj.faculty;
        const status = Math.random() > 0.1 ? 'Present' : 'Absent';
        attendanceRecords.push({ student: student._id, subject: subj._id, faculty: facultyForSubj, date, status });
      }
    }
    await Attendance.insertMany(attendanceRecords);

    console.log('Seed completed. Dev admin:', 'admin@example.com', 'Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
