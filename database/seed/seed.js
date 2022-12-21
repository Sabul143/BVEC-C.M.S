const mysql = require('mysql');
const env = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid').v4;

env.config();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cumdbms',
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Mysql Connected');
});
// Database query promises
const zeroParamPromise = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

const queryParamPromise = (sql, queryParam) => {
  return new Promise((resolve, reject) => {
    db.query(sql, queryParam, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};
const relations = [
  'assignment_submission',
  'marks',
  'attendance',
  'assignment',
  'class',
  'fee',
  'student',
  'staff',
  'course',
  'admin',
  'department',
];

const department_data = [
  { dept_id: 'ECE', d_name: 'Electronics and Communications Engineering' },
  { dept_id: 'CSE', d_name: 'Computer Science and Engineering' },
  { dept_id: 'ME', d_name: 'Mechanical Engineering' },
  { dept_id: 'CE', d_name: 'Civil Engineering' },
  { dept_id: 'Maths', d_name: 'Mathematics' },
  { dept_id: 'Che', d_name: 'Chemistry' },
  { dept_id: 'Phy', d_name: 'Physics' },
  { dept_id: 'Huma', d_name: 'Humanaties' },
];

const ece_courses = [
  {
    semester: 1,
    c_id: 'ECE01',
    name: 'Electronic Engineering Materials',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ECE02',
    name: 'Electronics I',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ECE03',
    name: 'Digital Circuits and Systems',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ECE04',
    name: 'Electrical Machines',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE05',
    name: 'Mathematics III',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE06',
    name: 'Electronics II',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE07',
    name: 'Network Analysis and Synthesis',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE08',
    name: 'Signals and Systems',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ECE09',
    name: 'Electromagnetic Field Theory',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE10',
    name: 'Linear Integrated Circuits',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE11',
    name: 'Data Structures',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE12',
    name: 'Transmission Lines and Waveguides',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE13',
    name: 'Probability Theory and Communication',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ECE14',
    name: 'Control Systems',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ECE15',
    name: 'Digital Signal Processing',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ECE16',
    name: 'Digital Communication',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ECE17',
    name: 'Microprocessor and its Applications',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ECE18',
    name: 'Antenna and Wave Propagation',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ECE19',
    name: 'Microwave Engineering',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ECE20',
    name: 'VLSI',
    c_type: 'Practical',
    dept_id: 'ECE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ECE21',
    name: 'Computer Networks',
    c_type: 'Theory',
    dept_id: 'ECE',
    credits: 4,
  },
];

const cse_courses = [
  {
    semester: 1,
    c_id: 'CSE01',
    name: 'Discrete Structures',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'CSE02',
    name: 'Data Structures',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'CSE03',
    name: 'Digital Logic Design',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'CSE04',
    name: 'Analog and Digital Communication',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE05',
    name: 'Design and Analysis of Algorithms',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE06',
    name: 'Database Management Systems',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE07',
    name: 'Object Orientation',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE08',
    name: 'Computer Architecture and Organization',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSE09',
    name: 'Analog Electronics',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE10',
    name: 'Microprocessors',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE11',
    name: 'Software Engineering',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE12',
    name: 'Computer Graphics',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE13',
    name: 'Computer Networking',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSE14',
    name: 'Operating Systems',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSE15',
    name: 'Theory of Computation',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSE16',
    name: 'High Performance Computing',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSE17',
    name: 'Compiler Construction',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSE18',
    name: 'Modeling and Simulation',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'CSE19',
    name: 'Computer Control Systems',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'CSE20',
    name: 'IT Law and Ethics',
    c_type: 'Theory',
    dept_id: 'CSE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'CSE21',
    name: 'Open Source Technologies',
    c_type: 'Practical',
    dept_id: 'CSE',
    credits: 4,
  },
];
const ce_courses = [
  {
    semester: 1,
    c_id: 'CE01',
    name: ' ',
    c_type: 'Practical',
    dept_id: 'CE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'CE02',
    name: 'Applied Mechanics',
    c_type: 'Theory',
    dept_id: 'CE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE03',
    name: 'Signals and Systems',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ICE04',
    name: 'Power Apparatus',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ICE05',
    name: 'Electronic Instrumentation',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ICE06',
    name: 'Electronics',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ICE07',
    name: 'Engineering Graphics',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ICE08',
    name: 'Data Structures',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ICE09',
    name: 'Chemistry',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ICE10',
    name: 'Mathematics-III',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ICE11',
    name: 'Control System-I',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ICE12',
    name: 'Transducer & measurement',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ICE13',
    name: 'Industrial Electronics',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ICE14',
    name: 'Digital Circuits and Systems',
    c_type: 'Theory',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ICE15',
    name: 'Microprocessor and Microcontroller',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ICE16',
    name: 'Process Dynamics and Control',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ICE17',
    name: 'Analog and Digital Communication',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ICE18',
    name: 'Control System-II',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ICE19',
    name: 'Industrial Instrumentation',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ICE20',
    name: 'Robotics',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ICE21',
    name: 'Digital Signal Processing',
    c_type: 'Practical',
    dept_id: 'ICE',
    credits: 4,
  },
];
const me_courses = [
  {
    semester: 1,
    c_id: 'ME01',
    name: 'Chemistry',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME02',
    name: 'Engineering Mechanics',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME03',
    name: 'Workshop Technology',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'ME04',
    name: 'Engineering Graphics',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ME05',
    name: 'Machine Drawing',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ME06',
    name: 'Manufacturing Processes-I',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ME07',
    name: 'Mathematics - III',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ME08',
    name: 'Thermal Engineering',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'ME09',
    name: 'Science of Materials',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ME10',
    name: 'Kinematics & Dynamics of Machines',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ME11',
    name: 'Mechanics of Solids',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ME12',
    name: 'Fluid Mechanics',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ME13',
    name: 'Manufacturing Processes-II',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'ME14',
    name: 'Management of Manufacturing Systems',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ME15',
    name: 'Industrial Engineering',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ME16',
    name: 'Refrigeration & Air- conditioning',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ME17',
    name: 'Transducer and Measurement',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'ME18',
    name: 'Control Systems',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ME19',
    name: 'Heat & Mass Transfer',
    c_type: 'Theory',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ME20',
    name: 'Fluid Systems',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ME21',
    name: 'Machine Element Design',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'ME22',
    name: 'Mechanical Vibration',
    c_type: 'Practical',
    dept_id: 'ME',
    credits: 4,
  },
];


const reset = async () => {
  try {
    await new Promise((r) => setTimeout(r, 2000)); // wait for mysql connection
    await zeroParamPromise('SET FOREIGN_KEY_CHECKS = 0');
    for (let i = 0; i < relations.length; ++i) {
      await zeroParamPromise('TRUNCATE TABLE ' + relations[i]);
      console.log(relations[i] + ' truncated');
    }
    await zeroParamPromise('SET FOREIGN_KEY_CHECKS = 1');

    // 1.Add Admin
    const hashedPassword = await bcrypt.hash('iloveyou', 8);
    await queryParamPromise('insert into admin set ?', {
      admin_id: sabul143(),
      name: 'Sabul Hussain Laskar',
      email: 'admin@gmail.com',
      password: hashedPassword,
    });
    await queryParamPromise('insert into admin set ?', {
      admin_id: sabul143(),
      name: 'Sabul Hussain Laskar',
      email: 'sabul@gmail.com',
      password: hashedPassword,
    });
    console.log('admin added');
    // 2.Add Departments
    for (let i = 0; i < department_data.length; ++i) {
      await queryParamPromise(
        'insert into department set ?',
        department_data[i]
      );
    }
    console.log('departments added');
    // 3.Add Courses
    for (let i = 0; i < ece_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', ece_courses[i]);
    }
    for (let i = 0; i < cse_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', cse_courses[i]);
    }
    for (let i = 0; i < me_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', me_courses[i]);
    }
    for (let i = 0; i < ce_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', ce_courses[i]);
    }
    for (let i = 0; i < Maths_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', Maths_courses[i]);
    }
    for (let i = 0; i < Che_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', Che_courses[i]);
    }
    for (let i = 0; i < Huma_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', Huma_courses[i]);
    }
    for (let i = 0; i < Phy_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', Phy_courses[i]);
    }
    
    console.log('courses added');
    // 4.Add Staffs
    for (let i = 0; i < staffData.length; ++i) {
      const currentStaff = staffData[i];
      const dept_id = department_data[parseInt(i / 15)].dept_id;
      const gender = i % 2 === 0 ? 'Male' : 'Female';
      const hashedPassword = await bcrypt.hash('iloveyoustaff', 8);
      await queryParamPromise('insert into staff set ?', {
        st_id: uuidv4(),
        st_name: currentStaff.st_name,
        gender,
        dob: currentStaff.dob,
        email: currentStaff.email,
        st_address:
          currentStaff.st_address +
          '-' +
          currentStaff.city +
          '-' +
          currentStaff.zip,
        contact: currentStaff.contact.split(' ')[0],
        dept_id,
        password: hashedPassword,
      });
    }
    console.log('staffs added');

    // 5.Add Students
    for (let i = 0; i < studentsData.length; ++i) {
      let currentStudent = studentsData[i];
      const hashedPassword = await bcrypt.hash('iloveyoustudent', 8);
      currentStudent = {
        s_id: uuidv4(),
        ...currentStudent,
        password: hashedPassword,
      };
      await queryParamPromise('insert into student set ?', currentStudent);
    }
    console.log('students added');
    // 5.Add Classes
    for (department of department_data) {
      const dept_id = department.dept_id;
      const staffs = await queryParamPromise(
        'SELECT st_id from staff where dept_id = ?',
        [dept_id]
      );
      const courses = await queryParamPromise(
        'SELECT c_id from course where dept_id = ? AND semester = ?',
        [dept_id, 1]
      );
      let st_idx = 0;
      for (let j = 0; j < courses.length; ++j) {
        await queryParamPromise('INSERT INTO class set ?', {
          section: 1,
          semester: 1,
          c_id: courses[j].c_id,
          st_id: staffs[st_idx++].st_id,
        });
        await queryParamPromise('INSERT INTO class set ?', {
          section: 2,
          semester: 1,
          c_id: courses[j].c_id,
          st_id: staffs[st_idx++].st_id,
        });
        await queryParamPromise('INSERT INTO class set ?', {
          section: 3,
          semester: 1,
          c_id: courses[j].c_id,
          st_id: staffs[st_idx++].st_id,
        });
      }
    }
    console.log('Classes Added');
  } catch (err) {
    throw err;
  } finally {
    process.exit();
  }
};
reset();
