import Plan from "../models/planModel.js";

// Seed default plans if collection is empty
const seedDefaultPlans = async () => {
  const count = await Plan.countDocuments();
  if (count === 0) {
    const defaultPlans = [
      {
        name: "6 Months Plan",
        description: "Perfect for upcoming target competitive exams.",
        price: 199,
        originalPrice: 499,
        discountPercentage: "60% OFF",
        duration: "Access for 6 Months",
        features: [
          "All Exams & Test Series",
          "Unlimited Practice Tests",
          "Detailed Solutions & Hints",
          "Standard Performance Analytics",
          "24/7 Support via Help Desk"
        ],
        isRecommended: false,
        isActive: true
      },
      {
        name: "12 Months Plan",
        description: "Best for continuous long-term prep & updates.",
        price: 299,
        originalPrice: 999,
        discountPercentage: "70% OFF",
        duration: "Access for 12 Months",
        features: [
          "All Exams & Test Series",
          "Unlimited Practice Tests",
          "Advanced Category Analytics",
          "Priority Live Chat Support",
          "1-on-1 Strategy Mentorship Session",
          "Descriptive Exam Prep Resources"
        ],
        isRecommended: true,
        isActive: true
      },
      {
        name: "Lifetime Access",
        description: "Pay once, prepare forever with zero limits.",
        price: 999,
        originalPrice: 2999,
        discountPercentage: "67% OFF",
        duration: "Forever Validity",
        features: [
          "Lifetime Unlocked Access",
          "Includes All Future Test Series",
          "Advanced Category Analytics",
          "VIP Direct-Line Support",
          "Exclusive Strategy Workbooks",
          "No Renewals or Top-ups Needed"
        ],
        isRecommended: false,
        isActive: true
      }
    ];
    await Plan.insertMany(defaultPlans);
  }
};

// @desc    Get all active plans
// @route   GET /api/plans
// @access  Public
export const getPlans = async (req, res) => {
  try {
    await seedDefaultPlans();
    
    // Admins might want to see all plans including inactive ones, but users only active ones.
    // For simplicity, we just fetch all plans. If we need to filter, we can check req.user.role if it was protected, 
    // but this is public. We'll return all plans, and let the frontend filter if needed.
    const plans = await Plan.find().sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new plan
// @route   POST /api/plans
// @access  Private/Admin
export const createPlan = async (req, res) => {
  try {
    const plan = new Plan(req.body);
    const createdPlan = await plan.save();
    res.status(201).json(createdPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    Object.assign(plan, req.body);
    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.deleteOne();
    res.json({ message: "Plan removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
