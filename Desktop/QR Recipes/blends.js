var blends = [
  {
    id: 'smoke-house',
    name: 'Smoke House',
    tagline: 'Real Smoke Flavor. No Smoker Required.',
    description: 'Built for barbecue lovers. Rich, deep smoky flavor perfect for burgers, ribs, chicken, pork, eggs, potatoes, and vegetables — no pit required.',
    image: 'Smoke House.png',
    greatOn: ['Burgers', 'Ribs', 'Chicken', 'Pork', 'Eggs', 'Potatoes', 'Vegetables'],
    retail: {
      headline: 'AWARD-WINNING BBQ FLAVOR',
      copy: 'Rich smoke. Deep savory flavor. Built for far more than the grill.',
      perfectFor: ['Ribs', 'Brisket', 'Pulled Pork', 'Chicken', 'Seafood', 'Lamb', 'Vegetables'],
      support: 'Whether you grill, roast, bake, or sauté, Smoke House adds the bold flavor that keeps people coming back for another bite.'
    },
    signature: {
      title: 'Smoke House Smash Burger',
      ingredients: [],
      instructions: 'Mix seasoning into ground beef. Form loose balls, place on a hot cast iron griddle, and smash flat. Sear undisturbed until a crust forms, then flip once and serve.'
    },
    bonus: {
      title: 'Smoke House Burger Aioli',
      ingredients: ['Mayonnaise', 'Yellow mustard', 'Smoke House seasoning'],
      instructions: 'Mix mayonnaise, a spoonful of mustard, and Smoke House to taste. Use as a burger sauce, fry dip, or sandwich spread.'
    },
    tags: ['burgers', 'ribs', 'chicken', 'pork', 'eggs', 'potatoes', 'vegetables', 'bbq', 'barbecue', 'smoke', 'smash burger', 'aioli', 'beef', 'ground beef', 'smoky', 'grill']
  },
  {
    id: 'chop-house',
    name: 'Chop House',
    tagline: 'Steakhouse Flavor. Every Night.',
    description: 'Garlic, cracked pepper, herbs, and savory spices create rich steakhouse flavor. Built for steaks first, but equally delicious on burgers, chops, chicken, potatoes, and vegetables.',
    image: 'ChopHouse.png',
    greatOn: ['Steak', 'Burgers', 'Pork Chops', 'Chicken', 'Lamb', 'Potatoes', 'Mushrooms', 'Vegetables'],
    retail: {
      headline: 'THE STEAKHOUSE EXPERIENCE WITHOUT THE RESERVATION',
      copy: 'Bring home the rich, savory flavor found in premium steakhouse kitchens.',
      perfectFor: ['Steaks', 'Burgers', 'Lamb', 'Pork Chops', 'Potatoes', 'Gravies', 'Pan Sauces'],
      support: 'From weeknight dinners to special occasions, Chop House delivers chef-worthy flavor with every shake.'
    },
    signature: {
      title: 'Perfect Chop House Ribeye',
      ingredients: [],
      instructions: 'Season ribeye generously on both sides. Sear over high heat 3–4 minutes per side. Rest 5 minutes before slicing and serving.'
    },
    bonus: {
      title: 'Chop House Compound Butter',
      ingredients: ['1 stick softened butter', '1 tbsp Chop House seasoning'],
      instructions: 'Mix until fully combined. Roll in parchment paper and refrigerate. Slice and melt over hot steak, chicken, or chops.'
    },
    tags: ['steak', 'burgers', 'pork chops', 'chicken', 'lamb', 'potatoes', 'mushrooms', 'vegetables', 'ribeye', 'steakhouse', 'compound butter', 'beef', 'garlic', 'pepper', 'grill']
  },
  {
    id: 'deep-blue',
    name: 'Deep Blue Seafood',
    tagline: 'Made To Bring Out The Best In Seafood.',
    description: 'Crafted to enhance seafood without overpowering it. A perfect balance of herbs and spices that lets the natural ocean flavor shine through.',
    image: 'Seafood.png',
    greatOn: ['Shrimp', 'Fish', 'Crab', 'Lobster', 'Scallops', 'Salmon', 'Chowders', 'Seafood Boils'],
    retail: {
      headline: 'SEAFOOD DONE RIGHT',
      copy: 'Your go-to blend for fish, shrimp, crab, lobster, scallops, and more.',
      perfectFor: ['Fish', 'Shrimp', 'Crab', 'Lobster', 'Scallops', 'Seafood Boils'],
      support: 'Bright, savory flavor designed to enhance seafood, not overpower it. Great in butter sauces, seafood boils, and everyday cooking.'
    },
    signature: {
      title: 'Seafood Scampi',
      ingredients: [],
      instructions: 'Season shrimp with Deep Blue Seafood Blend. Sauté in butter and garlic over medium-high heat until pink and cooked through. Serve over pasta with a squeeze of lemon.'
    },
    bonus: {
      title: 'Seafood Butter',
      ingredients: ['1 stick softened butter', '1 tbsp Deep Blue Seafood Blend'],
      instructions: 'Mix until fully combined. Melt over any seafood — shrimp, fish fillets, crab legs, lobster tails, or scallops.'
    },
    tags: ['shrimp', 'fish', 'crab', 'lobster', 'scallops', 'salmon', 'chowders', 'seafood boils', 'seafood', 'scampi', 'butter', 'boil', 'lemon', 'garlic', 'pasta', 'ocean']
  },
  {
    id: 'universal-all-purpose',
    name: 'Universal All-Purpose',
    tagline: 'Your New Favorite Seasoning',
    description: 'Balanced, savory, slightly sweet, and packed with flavor. Universal All-Purpose enhances everything from meats and vegetables to eggs, popcorn, chips, dips, soups, and snacks.',
    image: 'Another all purpose.png',
    greatOn: ['Chicken', 'Beef', 'Pork', 'Fish', 'Shrimp', 'Eggs', 'Vegetables', 'Soups', 'Popcorn', 'Chips', 'Nuts', 'Dips'],
    retail: {
      headline: 'ONE BLEND. ENDLESS POSSIBILITIES.',
      copy: 'Sweet. Savory. Umami-rich.',
      perfectFor: ['Chicken', 'Beef', 'Pork', 'Seafood', 'Vegetables', 'Eggs', 'Potatoes'],
      support: "If you're only grabbing one seasoning tonight, make it this one."
    },
    signature: {
      title: 'Pixy Dust Party Dip',
      ingredients: ['8 oz cream cheese', '8 oz sour cream', '1 tbsp Universal All-Purpose'],
      instructions: 'Mix all ingredients until smooth. Chill and serve with chips, crackers, or veggies.'
    },
    bonus: {
      title: 'Seasoned Popcorn',
      ingredients: [],
      instructions: 'Toss fresh popcorn with melted butter and Universal All-Purpose. Impossible to stop eating.'
    },
    tags: ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'eggs', 'vegetables', 'soups', 'popcorn', 'chips', 'nuts', 'dips', 'cream cheese', 'sour cream', 'party', 'snacks', 'dip']
  },
  {
    id: 'sugar-free-all-purpose',
    name: 'Sugar-Free All-Purpose',
    tagline: 'All The Flavor. No Added Sugar.',
    description: 'Everything you love about our original blend without added sugar. Clean, versatile flavor perfect for grilling, vegetables, proteins, meal prep, and everyday cooking.',
    image: 'Sugar free AP.png',
    greatOn: ['Chicken', 'Fish', 'Beef', 'Pork', 'Eggs', 'Vegetables', 'Salads', 'Meal Prep'],
    retail: {
      headline: 'ALL THE FLAVOR. NONE OF THE SUGAR.',
      copy: 'Everything you love about our signature blend without compromise.',
      perfectFor: ['Chicken', 'Beef', 'Pork', 'Seafood', 'Vegetables', 'Eggs'],
      support: 'Perfect for low-carb lifestyles and everyday cooking.'
    },
    signature: {
      title: 'Air Fryer Chicken Tenders',
      ingredients: [],
      instructions: 'Season chicken tenders generously on both sides. Air fry at 400°F for 10–12 minutes until golden and crispy.'
    },
    bonus: {
      title: 'Meal Prep Chicken',
      ingredients: [],
      instructions: 'Season chicken breasts and bake at 400°F for 22–25 minutes, or grill over medium-high heat. Slice and use throughout the week.'
    },
    tags: ['chicken', 'fish', 'beef', 'pork', 'eggs', 'vegetables', 'salads', 'meal prep', 'air fryer', 'tenders', 'sugar free', 'keto', 'low sugar', 'grilling', 'healthy', 'diet']
  },
  {
    id: 'garlic-pepper',
    name: 'Garlic Pepper',
    tagline: 'Three Simple Flavors. Endless Possibilities.',
    description: 'Garlic, pepper, and savory spices create one of the most versatile blends in the collection. Works on everything, every time.',
    image: 'Garlic Pepper.png',
    greatOn: ['Steak', 'Chicken', 'Fish', 'Shrimp', 'Pork', 'Lamb', 'Potatoes', 'Vegetables'],
    retail: {
      headline: "THE BLEND YOU'LL REACH FOR EVERY DAY",
      copy: 'Simple. Bold. Essential.',
      perfectFor: ['Steaks', 'Chicken', 'Seafood', 'Eggs', 'Vegetables', 'Potatoes'],
      support: 'Built around the timeless combination of garlic and pepper that makes almost everything taste better.'
    },
    signature: {
      title: 'Garlic Pepper Shrimp Skewers',
      ingredients: [],
      instructions: 'Season shrimp generously. Thread onto skewers and grill over high heat 2–3 minutes per side until pink and slightly charred.'
    },
    bonus: {
      title: 'Garlic Pepper Butter',
      ingredients: [],
      instructions: 'Mix softened butter with Garlic Pepper to taste. Serve melted over steak, fish, roasted potatoes, or steamed vegetables.'
    },
    tags: ['steak', 'chicken', 'fish', 'shrimp', 'pork', 'lamb', 'potatoes', 'vegetables', 'garlic', 'pepper', 'skewers', 'butter', 'grilling', 'seafood']
  },
  {
    id: 'southwest',
    name: 'Southwest',
    tagline: 'The Flavor Of Fajita Night.',
    description: 'Bold Southwestern spices deliver big flavor for tacos, fajitas, grilled meats, vegetables, rice bowls, sauces, and dressings.',
    image: 'Southwest.png',
    greatOn: ['Chicken', 'Steak', 'Ground Beef', 'Shrimp', 'Fish', 'Tacos', 'Fajitas', 'Rice Bowls', 'Vegetables'],
    retail: {
      headline: 'BRING THE SIZZLE HOME',
      copy: 'Bold Southwestern flavor that goes far beyond fajitas.',
      perfectFor: ['Steak', 'Chicken', 'Shrimp', 'Tacos', 'Rice', 'Vegetables', 'Street Corn'],
      support: 'From taco night to grilled meats and rice bowls, Southwest brings restaurant-style flavor home.'
    },
    signature: {
      title: 'Sheet Pan Chicken Fajitas',
      ingredients: [],
      instructions: 'Season sliced chicken, bell peppers, and onions with Southwest. Spread on a sheet pan and roast at 425°F for 20–25 minutes. Serve with warm tortillas.'
    },
    bonus: {
      title: 'Southwest Ranch',
      ingredients: [],
      instructions: 'Stir Southwest seasoning into ranch dressing to taste. Use as a dip, salad dressing, or taco sauce. Addictive on everything.'
    },
    tags: ['chicken', 'steak', 'ground beef', 'shrimp', 'fish', 'tacos', 'fajitas', 'rice bowls', 'vegetables', 'southwest', 'ranch', 'tex-mex', 'mexican', 'peppers', 'onions', 'tortilla']
  },
  {
    id: 'jerk-bbq',
    name: 'Jerk BBQ',
    tagline: 'Caribbean Flavor With A Kick.',
    description: 'Savory spices and balanced heat make Jerk BBQ one of the most versatile blends in the collection. Bold, complex, and deeply craveable.',
    image: 'jerk2.png',
    greatOn: ['Chicken', 'Pork', 'Shrimp', 'Fish', 'Pasta', 'Wings', 'Sandwiches', 'Vegetables'],
    retail: {
      headline: 'BRING THE ISLANDS TO YOUR BACKYARD',
      copy: 'Sweet heat. Bold spice. Deep Caribbean flavor.',
      perfectFor: ['Chicken', 'Pork', 'Shrimp', 'Wings', 'Ribs', 'Rice Bowls'],
      support: 'Perfect as a marinade, grilling rub, sandwich spread, or flavor-packed finishing sauce.'
    },
    signature: {
      title: 'Creamy Jerk Chicken Pasta',
      ingredients: [],
      instructions: 'Season chicken generously and grill. Slice and toss with cooked pasta and a simple cream sauce. Finish with a sprinkle of Jerk BBQ seasoning over the top.'
    },
    bonus: {
      title: 'Jerk Mayo',
      ingredients: [],
      instructions: 'Mix Jerk BBQ seasoning into mayonnaise to taste. Spread on sandwiches and burgers, or use as a bold dipping sauce for wings and fries.'
    },
    tags: ['chicken', 'pork', 'shrimp', 'fish', 'pasta', 'wings', 'sandwiches', 'vegetables', 'jerk', 'caribbean', 'spicy', 'mayo', 'cream sauce', 'jamaican', 'hot', 'kick', 'bbq']
  },
  {
    id: 'asian-stir-fry',
    name: 'Asian Stir Fry',
    tagline: 'Sweet. Savory. Umami.',
    description: 'One shake delivers layers of flavor normally requiring multiple ingredients. Perfect for fried rice, stir fry, noodles, and any Asian-inspired dish.',
    image: 'asian.png',
    greatOn: ['Fried Rice', 'Noodles', 'Chicken', 'Shrimp', 'Beef', 'Vegetables', 'Soups', 'Stir Fry'],
    retail: {
      headline: 'TAKEOUT FLAVOR. MADE AT HOME.',
      copy: 'Savory, balanced flavor built for quick meals and big flavor.',
      perfectFor: ['Chicken', 'Beef', 'Shrimp', 'Noodles', 'Rice', 'Vegetables'],
      support: 'Great in stir fry, fried rice, soups, marinades, and even creamy dips.'
    },
    signature: {
      title: 'Better Than Takeout Fried Rice',
      ingredients: [],
      instructions: 'Cook day-old rice in a hot wok with oil, vegetables, and protein. Push to the side, scramble an egg, then combine. Season generously with Asian Stir Fry and toss until fragrant.'
    },
    bonus: {
      title: 'Asian Dipping Sauce',
      ingredients: ['Soy sauce', 'Honey', 'Asian Stir Fry seasoning'],
      instructions: 'Whisk together soy sauce, a drizzle of honey, and Asian Stir Fry to taste. Use as a dipping sauce, stir-fry sauce, or marinade.'
    },
    tags: ['fried rice', 'noodles', 'chicken', 'shrimp', 'beef', 'vegetables', 'soups', 'stir fry', 'asian', 'chinese', 'wok', 'takeout', 'umami', 'soy', 'honey', 'ramen', 'egg', 'teriyaki']
  }
];
window.PIXY_BLENDS = blends;
