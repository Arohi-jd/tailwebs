import { config } from './config.js';
import { connectDB } from './db.js';
import { User } from './models/User.js';

const seedUsers = [
  {
    name: 'Mr. Smith',
    email: 'teacher@test.com',
    password: 'teacher123',
    role: 'teacher',
  },
  {
    name: 'Alice',
    email: 'alice@test.com',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Bob',
    email: 'bob@test.com',
    password: 'student123',
    role: 'student',
  },
];

const runSeed = async () => {
  try {
    if (!config.mongoUri) throw new Error('MONGO_URI missing');

    await connectDB();

    const emails = seedUsers.map((user) => user.email);
    await User.deleteMany({ email: { $in: emails } });

    await User.create(seedUsers);

    console.log('Users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

runSeed();
