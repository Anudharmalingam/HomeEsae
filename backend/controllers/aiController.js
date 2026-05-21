const Anthropic = require('@anthropic-ai/sdk');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');

exports.diagnoseProblem = async (req, res) => {
  try {
    const { message, history } = req.body;
    let category = 'maid';
    let priceRange = '₹150 - ₹300/hr';
    let serviceLabel = 'Maid Service';

    const lowerMsg = message.toLowerCase();
    
    // Simple rule-based checking for booking intent
    if (lowerMsg.includes('book') && lowerMsg.includes('tomorrow')) {
        // Create a booking
        const newBooking = await Booking.create({
            user: req.user ? req.user._id : null, 
            worker: null, 
            serviceType: 'maid',
            date: new Date(),
            time: '10:00 AM',
            price: 300,
            address: 'Default Address',
            isUrgent: false,
            isEmergency: false,
        });

        return res.json({
            service: 'maid',
            priceRange: '₹300',
            serviceLabel: 'Maid',
            suggestedWorkers: [],
            responseText: `Booking created for maid on tomorrow at 10 AM.`,
            bookingCreated: true,
            bookingDetails: { type: 'maid', date: 'tomorrow', time: '10 AM' }
        });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      if (lowerMsg.includes('leak') || lowerMsg.includes('pipe') || lowerMsg.includes('tap') || lowerMsg.includes('plumb')) {
        category = 'plumber';
        priceRange = '₹150 - ₹300/hr';
        serviceLabel = 'Plumbing';
      } else if (lowerMsg.includes('ac') || lowerMsg.includes('cooler') || lowerMsg.includes('cooling') || lowerMsg.includes('ac ')) {
        category = 'ac_service_repair';
        priceRange = '₹300 - ₹800/unit';
        serviceLabel = 'AC Service & Repair';
      } else if (lowerMsg.includes('fan') || lowerMsg.includes('wire') || lowerMsg.includes('shock') || lowerMsg.includes('bulb') || lowerMsg.includes('electric') || lowerMsg.includes('light')) {
        category = 'electrician';
        priceRange = '₹150 - ₹300/hr';
        serviceLabel = 'Electrical Services';
      } else if (lowerMsg.includes('clean') || lowerMsg.includes('dirty') || lowerMsg.includes('sweep') || lowerMsg.includes('dust')) {
        category = 'full_home_cleaning';
        priceRange = '₹80 - ₹150/hr';
        serviceLabel = 'Full Home Cleaning';
      } else if (lowerMsg.includes('food') || lowerMsg.includes('cook') || lowerMsg.includes('meal') || lowerMsg.includes('kitchen')) {
        category = 'personal_cook';
        priceRange = '₹400 - ₹700/day';
        serviceLabel = 'Cooking & Food';
      }
    } else {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const sysPrompt = `You are a diagnostic assistant. You must classify the user's issue into one of these exact categories:
        maid, cook, vessel_washing, laundry, painter, plumber, electrician, carpenter, appliances, full_home_cleaning, sofa_carpet_cleaning, bathroom_deep_clean, kitchen_deep_clean, post_construction_cleaning, water_tank_cleaning, personal_cook, party_catering, weekly_meal_prep, diet_nutrition_cook, ac_service_repair, ro_purifier_service, cctv_installation, smart_home_setup, civil_work, waterproofing, false_ceiling_interior, flooring_tiling, beauty_salon_at_home, spa_massage, yoga_fitness_trainer, elder_care, babysitting_nanny, pet_grooming, car_wash_at_home, bike_service, gardening_lawn_care, pest_control.
        
        If the user provides all booking details (type, date, time), return {"action": "book", "type": "[worker type]", "date": "[date]", "time": "[time]"}
        Otherwise return ONLY a JSON object in exactly this format:
        {"category": "[category]", "priceRange": "[price range]", "serviceLabel": "[human-readable label]"}
        `;
        const response = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 100,
          system: sysPrompt,
          messages: [{ role: 'user', content: message }]
        });
        try {
            const parsed = JSON.parse(response.content[0].text);
            if (parsed.action === 'book') {
                const newBooking = await Booking.create({
                    user: req.user ? req.user._id : null,
                    worker: null,
                    serviceType: parsed.type,
                    date: new Date(parsed.date),
                    time: parsed.time,
                    price: 0,
                    address: '',
                    isUrgent: false,
                    isEmergency: false,
                });
                return res.json({
                    responseText: `Booking created for ${parsed.type} on ${parsed.date} at ${parsed.time}.`,
                    bookingCreated: true,
                    bookingId: newBooking._id,
                    bookingDetails: parsed,
                });
            } else if (parsed.category) {
                category = parsed.category;
                priceRange = parsed.priceRange || priceRange;
                serviceLabel = parsed.serviceLabel || serviceLabel;
            }
        } catch (e) {
            console.log("Claude Diagnosis parse failed", e);
        }
    }

    // Query 3 best available workers in this category
    const workers = await Worker.find({ category })
      .populate('userId', 'name phone email')
      .sort({ rating: -1 })
      .limit(3);

    let suggestedWorkers = workers;
    if (suggestedWorkers.length === 0) {
      suggestedWorkers = await Worker.find()
        .populate('userId', 'name phone email')
        .sort({ rating: -1 })
        .limit(3);
    }

    let responseText = `Based on your description, you need **${serviceLabel}**. The estimated price range is **${priceRange}**. Here are the 3 best available professionals nearby:`;

    res.json({
      service: category,
      priceRange,
      serviceLabel,
      suggestedWorkers,
      responseText
    });

  } catch (error) {
    console.error('Diagnosis Error:', error);
    res.status(500).json({ message: 'Error diagnosing problem', error: error.message });
  }
};
