const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Worker = require('./models/Worker');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({ role: 'worker' });
    await Worker.deleteMany({});

    const password = await bcrypt.hash('password123', 10);

    const categories = [
      // Existing
      { id: 'maid', name: 'Maid', price: 400, type: 'hour' },
      { id: 'cook', name: 'Cooking', price: 500, type: 'hour' },
      { id: 'vessel_washing', name: 'Vessel Washing', price: 300, type: 'hour' },
      { id: 'laundry', name: 'Dry Laundry', price: 350, type: 'hour' },
      { id: 'painter', name: 'Painter', price: 1200, type: 'day' },
      { id: 'plumber', name: 'Plumber', price: 600, type: 'hour' },
      { id: 'electrician', name: 'Electrician', price: 650, type: 'hour' },
      { id: 'carpenter', name: 'Carpenter', price: 700, type: 'hour' },
      { id: 'appliances', name: 'Appliances Repair', price: 800, type: 'task' },

      // Home cleaning & care
      { id: 'home_cleaning', name: 'Home Cleaning', price: 100, type: 'hour' },
      { id: 'sofa_carpet_cleaning', name: 'Sofa & Carpet Cleaning', price: 700, type: 'task' },
      { id: 'bathroom_deep_clean', name: 'Bathroom Deep Clean', price: 450, type: 'task' },
      { id: 'kitchen_deep_clean', name: 'Kitchen Deep Clean', price: 600, type: 'task' },
      { id: 'post_construction_cleaning', name: 'Post-construction Cleaning', price: 1500, type: 'task' },
      { id: 'water_tank_cleaning', name: 'Water Tank Cleaning', price: 900, type: 'task' },

      // Cooking & food
      { id: 'personal_cook_maid', name: 'Personal Cook / Maid', price: 550, type: 'day' },
      { id: 'party_catering', name: 'Party Catering', price: 220, type: 'task' },
      { id: 'weekly_meal_prep', name: 'Weekly Meal Prep', price: 3000, type: 'task' },
      { id: 'diet_nutrition_cook', name: 'Diet & Nutrition Cook', price: 700, type: 'day' },

      // Repairs & maintenance
      { id: 'plumbing', name: 'Plumbing', price: 225, type: 'hour' },
      { id: 'appliance_repair', name: 'Appliance Repair', price: 350, type: 'task' },
      { id: 'ac_service_repair', name: 'AC Service & Repair', price: 550, type: 'task' },
      { id: 'carpentry', name: 'Carpentry', price: 450, type: 'hour' },
      { id: 'ro_purifier_service', name: 'RO Purifier Service', price: 400, type: 'task' },
      { id: 'cctv_installation', name: 'CCTV Installation', price: 1500, type: 'task' },
      { id: 'smart_home_setup', name: 'Smart Home Setup', price: 3000, type: 'task' },

      // Construction & renovation
      { id: 'painting', name: 'Painting', price: 450, type: 'day' },
      { id: 'civil_work', name: 'Civil Work', price: 600, type: 'day' },
      { id: 'waterproofing', name: 'Waterproofing', price: 60, type: 'task' },
      { id: 'false_ceiling_interior', name: 'False Ceiling & Interior', price: 90, type: 'task' },
      { id: 'flooring_tiling', name: 'Flooring & Tiling', price: 75, type: 'task' },

      // Personal & wellness
      { id: 'beauty_salon_at_home', name: 'Beauty & Salon at Home', price: 650, type: 'task' },
      { id: 'spa_massage', name: 'Spa & Massage', price: 1200, type: 'hour' },
      { id: 'yoga_fitness_trainer', name: 'Yoga & Fitness Trainer', price: 850, type: 'task' },
      { id: 'elder_care', name: 'Elder Care', price: 550, type: 'day' },
      { id: 'babysitting_nanny', name: 'Babysitting / Nanny', price: 450, type: 'day' },
      { id: 'pet_grooming', name: 'Pet Grooming', price: 700, type: 'task' },

      // Vehicle & outdoor
      { id: 'car_wash_at_home', name: 'Car Wash at Home', price: 300, type: 'task' },
      { id: 'bike_service', name: 'Bike Service', price: 300, type: 'task' },
      { id: 'gardening_lawn_care', name: 'Gardening & Lawn Care', price: 450, type: 'task' },
      { id: 'pest_control', name: 'Pest Control', price: 1500, type: 'task' }
    ];


    const names = [
      'Rajesh', 'Suresh', 'Ramesh', 'Mahesh', 
      'Anitha', 'Kavitha', 'Sunitha', 'Vanitha',
      'Arun', 'Varun', 'Tarun', 'Kiran',
      'Priya', 'Riya', 'Siya', 'Diya',
      'Vijay', 'Ajay', 'Sanjay', 'Dhananjay',
      'Meena', 'Reena', 'Teena', 'Beena',
      'Babu', 'Muthu', 'Velu', 'Ramu',
      'Lakshmi', 'Saraswathi', 'Parvathi', 'Durga',
      'Vimal', 'Kamal', 'Nimal', 'Amal'
    ];

    let nameIdx = 0;
    for (const cat of categories) {
      for (let i = 1; i <= 4; i++) {
        const workerName = names[nameIdx];
        const name = `${workerName} ${['Kumar', 'Singh', 'Devi', 'Prasad'][i-1]}`;
        const email = `${workerName.toLowerCase()}@example.com`;
        
        const user = await User.create({
          name,
          email,
          phone: `90000000${nameIdx < 10 ? '0'+nameIdx : nameIdx}`,
          password,
          role: 'worker',
          isVerified: true
        });

        await Worker.create({
          userId: user._id,
          category: cat.id,
          experience: Math.floor(Math.random() * 10) + 1,
          pricing: {
            amount: cat.price + (Math.floor(Math.random() * 100)),
            type: cat.type
          },
          location: { address: ['Chennai', 'Bangalore', 'Hyderabad', 'Mumbai'][i-1] },
          status: 'Active',
          rating: (Math.random() * 2 + 3).toFixed(1)
        });
        
        nameIdx++;
      }
    }

    console.log('Seed data created successfully with 36 workers across all categories!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
