export const serviceCatalog = [
  // Home cleaning & care
  {
    id: 'home_cleaning',
    label: 'Home Cleaning',
    icon: '🧼',
    pricingRange: { min: 80, max: 150 },
    pricingType: 'hour'
  },
  {
    id: 'sofa_carpet_cleaning',
    label: 'Sofa & Carpet Cleaning',
    icon: '🛋️',
    pricingRange: { min: 500, max: 1200 },
    pricingType: 'task'
  },
  {
    id: 'bathroom_deep_clean',
    label: 'Bathroom Deep Clean',
    icon: '🚿',
    pricingRange: { min: 300, max: 600 },
    pricingType: 'task'
  },
  {
    id: 'kitchen_deep_clean',
    label: 'Kitchen Deep Clean',
    icon: '🍳',
    pricingRange: { min: 400, max: 800 },
    pricingType: 'task'
  },
  {
    id: 'post_construction_cleaning',
    label: 'Post-construction Cleaning',
    icon: '🏗️',
    pricingRange: { min: 1000, max: 3000 },
    pricingType: 'task'
  },
  {
    id: 'water_tank_cleaning',
    label: 'Water Tank Cleaning',
    icon: '🚰',
    pricingRange: { min: 500, max: 1500 },
    pricingType: 'task'
  },

  // Cooking & food
  {
    id: 'personal_cook_maid',
    label: 'Personal Cook / Maid',
    icon: '👩‍🍳',
    pricingRange: { min: 400, max: 700 },
    pricingType: 'day'
  },
  {
    id: 'party_catering',
    label: 'Party Catering',
    icon: '🎉',
    pricingRange: { min: 150, max: 300 },
    pricingType: 'task'
  },
  {
    id: 'weekly_meal_prep',
    label: 'Weekly Meal Prep',
    icon: '🥗',
    pricingRange: { min: 2000, max: 4000 },
    pricingType: 'task'
  },
  {
    id: 'diet_nutrition_cook',
    label: 'Diet & Nutrition Cook',
    icon: '🥘',
    pricingRange: { min: 500, max: 900 },
    pricingType: 'day'
  },

  // Repairs & maintenance
  {
    id: 'plumbing',
    label: 'Plumbing',
    icon: '🔧',
    pricingRange: { min: 150, max: 300 },
    pricingType: 'hour'
  },
  {
    id: 'electrician',
    label: 'Electrician',
    icon: '⚡',
    pricingRange: { min: 150, max: 300 },
    pricingType: 'hour'
  },
  {
    id: 'appliance_repair',
    label: 'Appliance Repair',
    icon: '📺',
    pricingRange: { min: 200, max: 500 },
    pricingType: 'task'
  },
  {
    id: 'ac_service_repair',
    label: 'AC Service & Repair',
    icon: '❄️',
    pricingRange: { min: 300, max: 800 },
    pricingType: 'task'
  },
  {
    id: 'carpentry',
    label: 'Carpentry',
    icon: '🪚',
    pricingRange: { min: 300, max: 600 },
    pricingType: 'hour'
  },
  {
    id: 'ro_purifier_service',
    label: 'RO Purifier Service',
    icon: '💧',
    pricingRange: { min: 250, max: 600 },
    pricingType: 'task'
  },
  {
    id: 'cctv_installation',
    label: 'CCTV Installation',
    icon: '📷',
    pricingRange: { min: 800, max: 3000 },
    pricingType: 'task'
  },
  {
    id: 'smart_home_setup',
    label: 'Smart Home Setup',
    icon: '🏠',
    pricingRange: { min: 1500, max: 5000 },
    pricingType: 'task'
  },

  // Construction & renovation
  {
    id: 'painting',
    label: 'Painting',
    icon: '🎨',
    pricingRange: { min: 350, max: 600 },
    pricingType: 'day'
  },
  {
    id: 'civil_work',
    label: 'Civil Work',
    icon: '🧱',
    pricingRange: { min: 450, max: 800 },
    pricingType: 'day'
  },
  {
    id: 'waterproofing',
    label: 'Waterproofing',
    icon: '🛡️',
    pricingRange: { min: 40, max: 80 },
    pricingType: 'task',
    pricingUnit: 'sqft'
  },
  {
    id: 'false_ceiling_interior',
    label: 'False Ceiling & Interior',
    icon: '🧩',
    pricingRange: { min: 60, max: 120 },
    pricingType: 'task',
    pricingUnit: 'sqft'
  },
  {
    id: 'flooring_tiling',
    label: 'Flooring & Tiling',
    icon: '🧱',
    pricingRange: { min: 50, max: 100 },
    pricingType: 'task',
    pricingUnit: 'sqft'
  },

  // Personal & wellness
  {
    id: 'beauty_salon_at_home',
    label: 'Beauty & Salon at Home',
    icon: '💅',
    pricingRange: { min: 300, max: 1500 },
    pricingType: 'task'
  },
  {
    id: 'spa_massage',
    label: 'Spa & Massage',
    icon: '🧖‍♀️',
    pricingRange: { min: 800, max: 2000 },
    pricingType: 'hour'
  },
  {
    id: 'yoga_fitness_trainer',
    label: 'Yoga & Fitness Trainer',
    icon: '🧘',
    pricingRange: { min: 500, max: 1200 },
    pricingType: 'task'
  },
  {
    id: 'elder_care',
    label: 'Elder Care',
    icon: '👵',
    pricingRange: { min: 400, max: 700 },
    pricingType: 'day'
  },
  {
    id: 'babysitting_nanny',
    label: 'Babysitting / Nanny',
    icon: '🍼',
    pricingRange: { min: 300, max: 600 },
    pricingType: 'day'
  },
  {
    id: 'pet_grooming',
    label: 'Pet Grooming',
    icon: '🐾',
    pricingRange: { min: 400, max: 1000 },
    pricingType: 'task'
  },

  // Vehicle & outdoor
  {
    id: 'car_wash_at_home',
    label: 'Car Wash at Home',
    icon: '🚗',
    pricingRange: { min: 200, max: 500 },
    pricingType: 'task'
  },
  {
    id: 'bike_service',
    label: 'Bike Service',
    icon: '🏍️',
    pricingRange: { min: 200, max: 400 },
    pricingType: 'task'
  },
  {
    id: 'gardening_lawn_care',
    label: 'Gardening & Lawn Care',
    icon: '🌿',
    pricingRange: { min: 300, max: 600 },
    pricingType: 'task'
  },
  {
    id: 'pest_control',
    label: 'Pest Control',
    icon: '🪳',
    pricingRange: { min: 800, max: 2500 },
    pricingType: 'task'
  }
];

export const serviceCatalogById = serviceCatalog.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {});

