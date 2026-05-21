const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
enum: [
      'maid',
      'cook',
      'vessel_washing',
      'laundry',
      'painter',
      'plumber',
      'electrician',
      'carpenter',
      'appliances',
      // Home cleaning & care
      'home_cleaning',
      'sofa_carpet_cleaning',
      'bathroom_deep_clean',
      'kitchen_deep_clean',
      'post_construction_cleaning',
      'water_tank_cleaning',
      // Cooking & food
      'personal_cook_maid',
      'party_catering',
      'weekly_meal_prep',
      'diet_nutrition_cook',
// Repairs & maintenance
      'plumbing',
      'appliance_repair',
      'ac_service_repair',
      'carpentry',
      'ro_purifier_service',
      'cctv_installation',
      'smart_home_setup',
      // Construction & renovation
      'painting',
      'civil_work',
      'waterproofing',
      'false_ceiling_interior',
      'flooring_tiling',
      // Personal & wellness
      'beauty_salon_at_home',
      'spa_massage',
      'yoga_fitness_trainer',
      'elder_care',
      'babysitting_nanny',
      'pet_grooming',
      // Vehicle & outdoor
      'car_wash_at_home',
      'bike_service',
      'gardening_lawn_care',
      'pest_control',
      // existing catch-all
      'other'
    ]
  },
  experience: {
    type: Number, // Years of experience
    required: true,
  },
  pricing: {
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['hour', 'day', 'task'],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Pending Verification', 'Active', 'Inactive'],
    default: 'Pending Verification'
  },
  rating: {
    type: Number,
    default: 0
  },
  totalJobs: {
    type: Number,
    default: 0
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  }
}, {
  timestamps: true,
});

const Worker = mongoose.model('Worker', workerSchema);
module.exports = Worker;
