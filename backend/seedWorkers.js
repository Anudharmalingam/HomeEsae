const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Worker = require('./models/Worker');

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homemaid';
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
};

const seedWorkers = async () => {
  await connectDB();

  try {
    // Clear existing workers and their user accounts
    await Worker.deleteMany({});
    await User.deleteMany({ role: 'worker' });

    console.log('Cleared existing workers');

    const categories = ['maid', 'cook', 'plumber', 'electrician', 'home_cleaning'];
    const locations = [
      { type: 'Point', coordinates: [80.2707, 13.0827] }, // Chennai
      { type: 'Point', coordinates: [77.5946, 12.9716] }, // Bangalore
      { type: 'Point', coordinates: [78.4747, 17.3850] }  // Hyderabad
    ];

    const workersToCreate = [];

    for (let i = 1; i <= 10; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // Create user
      const user = await User.create({
        name: `Worker${i} Demo`,
        email: `worker${i}@easehome.com`,
        phone: `98765432${String(i).padStart(2, '0')}`,
        password: 'password123',
        role: 'worker',
        isVerified: true
      });

      // Create worker profile
      const worker = await Worker.create({
        userId: user._id,
        category: category,
        experience: Math.floor(Math.random() * 10) + 1, // 1 to 10 years
        hourlyRate: Math.floor(Math.random() * 200) + 100, // 100 to 300
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
        jobsCompleted: Math.floor(Math.random() * 100),
        availability: true,
        location: location,
        pricing: {
            amount: Math.floor(Math.random() * 500) + 200,
            type: 'hour'
        }
      });
      workersToCreate.push(worker);
    }

    console.log(`Successfully seeded ${workersToCreate.length} workers.`);
    process.exit();
  } catch (error) {
    console.error('Error seeding workers:', error);
    process.exit(1);
  }
};

seedWorkers();
