// Prepopulated food items database
export const foodItems = [
  // Proteins - Meat & Poultry
  {
    id: 'food_chicken_breast',
    name: 'Chicken Breast',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 165,
    proteinPerServing: 31,
    fatPerServing: 3.6,
    carbsPerServing: 0,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_ground_beef',
    name: 'Ground Beef (80% lean)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 254,
    proteinPerServing: 17,
    fatPerServing: 20,
    carbsPerServing: 0,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_turkey_breast',
    name: 'Turkey Breast',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 135,
    proteinPerServing: 30,
    fatPerServing: 0.7,
    carbsPerServing: 0,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Proteins - Fish & Seafood
  {
    id: 'food_salmon',
    name: 'Salmon',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 208,
    proteinPerServing: 20,
    fatPerServing: 13,
    carbsPerServing: 0,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_tuna',
    name: 'Tuna (canned in water)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 116,
    proteinPerServing: 26,
    fatPerServing: 0.8,
    carbsPerServing: 0,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_tilapia',
    name: 'Tilapia',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 129,
    proteinPerServing: 26,
    fatPerServing: 2.7,
    carbsPerServing: 0,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Proteins - Eggs & Dairy
  {
    id: 'food_egg_whole',
    name: 'Whole Egg',
    servingSize: 1,
    servingUnits: 'egg',
    caloriesPerServing: 72,
    proteinPerServing: 6,
    fatPerServing: 5,
    carbsPerServing: 0.4,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_egg_white',
    name: 'Egg White',
    servingSize: 1,
    servingUnits: 'egg',
    caloriesPerServing: 17,
    proteinPerServing: 3.6,
    fatPerServing: 0.1,
    carbsPerServing: 0.2,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_greek_yogurt',
    name: 'Greek Yogurt (plain, nonfat)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 59,
    proteinPerServing: 10,
    fatPerServing: 0.4,
    carbsPerServing: 3.6,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_cottage_cheese',
    name: 'Cottage Cheese (low-fat)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 72,
    proteinPerServing: 12,
    fatPerServing: 1,
    carbsPerServing: 4.3,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Proteins - Plant-based
  {
    id: 'food_tofu',
    name: 'Tofu (firm)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 144,
    proteinPerServing: 17,
    fatPerServing: 9,
    carbsPerServing: 2.3,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_black_beans',
    name: 'Black Beans (cooked)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 132,
    proteinPerServing: 8.9,
    fatPerServing: 0.5,
    carbsPerServing: 23.7,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Carbs - Grains
  {
    id: 'food_brown_rice',
    name: 'Brown Rice (cooked)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 112,
    proteinPerServing: 2.6,
    fatPerServing: 0.9,
    carbsPerServing: 23.5,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_white_rice',
    name: 'White Rice (cooked)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 130,
    proteinPerServing: 2.7,
    fatPerServing: 0.3,
    carbsPerServing: 28.2,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_oats',
    name: 'Oatmeal (cooked)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 71,
    proteinPerServing: 2.5,
    fatPerServing: 1.5,
    carbsPerServing: 12,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_pasta',
    name: 'Pasta (cooked)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 131,
    proteinPerServing: 5,
    fatPerServing: 1.1,
    carbsPerServing: 25,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_quinoa',
    name: 'Quinoa (cooked)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 120,
    proteinPerServing: 4.4,
    fatPerServing: 1.9,
    carbsPerServing: 21.3,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Carbs - Bread & Baked
  {
    id: 'food_whole_wheat_bread',
    name: 'Whole Wheat Bread',
    servingSize: 1,
    servingUnits: 'slice',
    caloriesPerServing: 82,
    proteinPerServing: 4,
    fatPerServing: 1.1,
    carbsPerServing: 13.8,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_white_bread',
    name: 'White Bread',
    servingSize: 1,
    servingUnits: 'slice',
    caloriesPerServing: 79,
    proteinPerServing: 2.3,
    fatPerServing: 1,
    carbsPerServing: 14.6,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Carbs - Starchy Vegetables
  {
    id: 'food_sweet_potato',
    name: 'Sweet Potato (baked)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 90,
    proteinPerServing: 2,
    fatPerServing: 0.2,
    carbsPerServing: 20.7,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_potato',
    name: 'Potato (baked)',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 93,
    proteinPerServing: 2.5,
    fatPerServing: 0.1,
    carbsPerServing: 21.2,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Vegetables
  {
    id: 'food_broccoli',
    name: 'Broccoli',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 34,
    proteinPerServing: 2.8,
    fatPerServing: 0.4,
    carbsPerServing: 6.6,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_spinach',
    name: 'Spinach',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 23,
    proteinPerServing: 2.9,
    fatPerServing: 0.4,
    carbsPerServing: 3.6,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_carrots',
    name: 'Carrots',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 41,
    proteinPerServing: 0.9,
    fatPerServing: 0.2,
    carbsPerServing: 9.6,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_bell_pepper',
    name: 'Bell Pepper',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 31,
    proteinPerServing: 1,
    fatPerServing: 0.3,
    carbsPerServing: 6,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Fruits
  {
    id: 'food_banana',
    name: 'Banana',
    servingSize: 1,
    servingUnits: 'medium',
    caloriesPerServing: 105,
    proteinPerServing: 1.3,
    fatPerServing: 0.4,
    carbsPerServing: 27,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_apple',
    name: 'Apple',
    servingSize: 1,
    servingUnits: 'medium',
    caloriesPerServing: 95,
    proteinPerServing: 0.5,
    fatPerServing: 0.3,
    carbsPerServing: 25,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_blueberries',
    name: 'Blueberries',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 57,
    proteinPerServing: 0.7,
    fatPerServing: 0.3,
    carbsPerServing: 14.5,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_strawberries',
    name: 'Strawberries',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 32,
    proteinPerServing: 0.7,
    fatPerServing: 0.3,
    carbsPerServing: 7.7,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Fats & Oils
  {
    id: 'food_olive_oil',
    name: 'Olive Oil',
    servingSize: 1,
    servingUnits: 'tbsp',
    caloriesPerServing: 119,
    proteinPerServing: 0,
    fatPerServing: 13.5,
    carbsPerServing: 0,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_peanut_butter',
    name: 'Peanut Butter',
    servingSize: 2,
    servingUnits: 'tbsp',
    caloriesPerServing: 188,
    proteinPerServing: 8,
    fatPerServing: 16,
    carbsPerServing: 6,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_almonds',
    name: 'Almonds',
    servingSize: 28,
    servingUnits: 'g',
    caloriesPerServing: 164,
    proteinPerServing: 6,
    fatPerServing: 14,
    carbsPerServing: 6,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_walnuts',
    name: 'Walnuts',
    servingSize: 28,
    servingUnits: 'g',
    caloriesPerServing: 185,
    proteinPerServing: 4.3,
    fatPerServing: 18.5,
    carbsPerServing: 3.9,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_avocado',
    name: 'Avocado',
    servingSize: 100,
    servingUnits: 'g',
    caloriesPerServing: 160,
    proteinPerServing: 2,
    fatPerServing: 14.7,
    carbsPerServing: 8.5,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Dairy
  {
    id: 'food_whole_milk',
    name: 'Whole Milk',
    servingSize: 240,
    servingUnits: 'ml',
    caloriesPerServing: 149,
    proteinPerServing: 7.7,
    fatPerServing: 7.9,
    carbsPerServing: 11.7,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'food_cheddar_cheese',
    name: 'Cheddar Cheese',
    servingSize: 28,
    servingUnits: 'g',
    caloriesPerServing: 114,
    proteinPerServing: 7,
    fatPerServing: 9.4,
    carbsPerServing: 0.4,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  },

  // Protein Supplements
  {
    id: 'food_whey_protein',
    name: 'Whey Protein Powder',
    servingSize: 1,
    servingUnits: 'scoop',
    caloriesPerServing: 120,
    proteinPerServing: 24,
    fatPerServing: 1.5,
    carbsPerServing: 3,
    isCustom: false,
    createdAt: '2026-01-21T10:00:00Z'
  }
]
