const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server/app');
const User = require('../server/models/User');
const Teacher = require('../server/models/Teacher');
const Student = require('../server/models/Student');
const Assignment = require('../server/models/Assignment');

const { UserDataFactory, AssignmentDataFactory } = require('./testDataFactories');

const request = supertest(app);

const {
  validNewUser,
  validNewUser2,
} = UserDataFactory;

const { validNewAssignment } = AssignmentDataFactory;

describe('[POST] /api/teacher/emailAssignments', () => {
  beforeAll((done) => {
    mongoose.connect('mongodb://localhost/Metronome_local_test');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', async () => {
      await Promise.all([
        Teacher.registerNewUser(validNewUser),
        User.registerNewUser(validNewUser2),
      ]);
      done();
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('assignments');
  });

  it('Should return an error if the request is not from a teacher', async () => {
    const user = await User.findOne({ email: validNewUser2.email });
    const response = await request
      .post('/api/teacher/emailAssignments')
      .set('Authorization', user.generateJWT())
      .send({ emails: 'test@example.com' });
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Not authorized');
  });

  it('Should return a 400 error from sendgrid if an email is invalid', async () => {
    const user = await Teacher.findOne({ email: validNewUser.email });
    const response = await request
      .post('/api/teacher/emailAssignments')
      .set('Authorization', user.generateJWT())
      .send({ emails: 'test@example.com,asdfg' });
    expect(response.status).toBe(400);
  });

  it('Should successfully send out emails if the emails are valid', async () => {
    const user = await Teacher.findOne({ email: validNewUser.email });
    const response = await request
      .post('/api/teacher/emailAssignments')
      .set('Authorization', user.generateJWT())
      .send(validNewAssignment);
    expect(response.status).toBe(200);
    expect(response.body.error).toBeUndefined();
  });
});

describe('[GET] /api/teacher/assignments', () => {
  beforeAll((done) => {
    mongoose.connect('mongodb://localhost/Metronome_local_test');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', async () => {
      await Promise.all([
        Teacher.registerNewUser(validNewUser),
        Student.registerNewUser(validNewUser2),
      ]);
      done();
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('assignments');
  });

  it('Should retrieve the assignments for the logged in teacher', async () => {
    const teacher = await Teacher.findOne({ email: validNewUser.email });
    const student = await Student.findOne({ email: validNewUser2.email });
    const assignment = new Assignment({
      ...validNewAssignment,
      teacher: teacher._id,
      students: [student._id],
      emails: [student.email],
    });
    await assignment.save();

    const response = await request
      .get('/api/teacher/assignments')
      .set('Authorization', teacher.generateJWT());
    expect(response.status).toBe(200);
    expect(response.body.assignments.length).toBeGreaterThan(0);
  });
});
