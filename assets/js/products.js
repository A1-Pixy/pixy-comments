/*
  assets/js/products.js
  Single source of truth for Pixy Dust Luxury Site (front-end).

  Rules enforced in this file:
  - Ecwid is cart/checkout only.
  - Pouches and Bottles include story + ingredients using the exact text you provided.
  - Individual Spices now include blurb + story + ingredients for product detail pages.
  - No guessing image filenames. If an image path is unknown, image is set to null.
*/

(function () {
  "use strict";

  // Exact story + ingredients text provided by you (Signature blends).
  var STORY = {
    "all-purpose": "Our All Purpose blend of herbs and spices was created to enhance the flavor profiles of your favorite foods.",
    "sugar-free-all-purpose": "Our Pixy Dust All Purpose was reformulated to cater to our Keto and Vegan friends so that they can enjoy the same flavor enhancements without the carbs.",
    "asian-stir-fry": "This selected blend of spices was made to create the same flavors as your favorite Asian restaurant. Easy and simple at home with just a few shakes.",
    "jerk": "This spice blend was inspired from my travels to the island of Jamaica. The unique flavor of the pimento smoked wood back home.",
    "fajita": "This spice blend was inspired by my journeys through Mexico.",
    "chop-house-steak": "We made this blend to the liking of how we like our steak seasoned. We keep it simple so that the protein Shine!",
    "smoke-bbq": "Born from championship BBQ competitions, this blend captures the rich aroma of hickory smoke and bold spices crafted for true pit masters.",
    "garlic-pepper": "The Base Of All Rubs. Garlic pepper seasoning is a robust spice blend that’s surprisingly versatile. It matches two of the most popular spice.",
    "deep-blue-seafood": "We want to create a perfect base for frying, baking or even grilling and we nailed it!"
  };

  var INGREDIENTS = {
    "all-purpose": "Salt, Black Pepper, Garlic, Onion, Paprika, Mustard, Celery Seed, Brown Sugar, Rice Hull for Anti Caking Agent, Chili Powder, Cumin and Herbs",
    "sugar-free-all-purpose": "Sea Salt, Black Pepper, Garlic, Turmeric, Onion, Paprika, Mustard, Celery Seed, Monk fruit, Rice Hull for Anti Caking Agent, Chili Powder, Cumin and Herbs",
    "asian-stir-fry": "Sea Salt, Black Pepper, Garlic, Onion, White Pepper, Brown Sugar, Ginger, Vinegar, Soy Sauce",
    "jerk": "Sea Salt, Black Pepper, Garlic, Onion, All Spice, Mustard, Celery Seed, Brown Sugar, Ginger, Dehydrated Soy Sauce, Chili, and Herbs",
    "fajita": "Sea Salt, Black Pepper, Garlic, Ginger, Smoked Paprika, Cumin, Soy sauce, Worcestershire, Lime, Chili Powder, Cumin and Herbs",
    "chop-house-steak": "Sea Salt, Black Pepper, Garlic, Onion, Paprika, Mustard, Red Pepper Flakes, Thyme",
    "smoke-bbq": "Smoked Sea Salt, Black Pepper, Smoked Garlic, Brown Sugar, Onion, Smoked Paprika, Mustard, Spices, and Herbs",
    "garlic-pepper": "Minced Garlic, Garlic Powder, Black Garlic Powder, Black Pepper, Course Sea Salt",
    "deep-blue-seafood": "Sea Salt, White Pepper, Paprika, Garlic, Onion, Celery Seed, Mustard, Ginger, Dried Lemon Peel, Soy Sauce Powder and Herbs"
  };

  var PRODUCTS = [
    // ===============================
    // Pouches (Category ID 194307011)
    // ===============================
    {
      key: "deep-blue-seafood",
      title: "Deep Blue Seafood",
      story: STORY["deep-blue-seafood"],
      ingredients: INGREDIENTS["deep-blue-seafood"],
      category: "Pouches",
      price: null,
      image: "assets/images/pouches/seafood.png",
      blurb: "Ocean-forward seasoning designed for seafood, butter sauces, and clean finishes.",
      ecwidProductId: 808797918
    },
    {
      key: "jerk",
      title: "Jerk",
      story: STORY["jerk"],
      ingredients: INGREDIENTS["jerk"],
      category: "Pouches",
      price: null,
      image: "assets/images/pouches/jerk.png",
      blurb: "Aromatic island spice. Great for chicken, pork, and grilled vegetables.",
      ecwidProductId: 808797912
    },
    {
      key: "garlic-pepper",
      title: "Garlic Pepper",
      story: STORY["garlic-pepper"],
      ingredients: INGREDIENTS["garlic-pepper"],
      category: "Pouches",
      price: null,
      image: "assets/images/pouches/Garlicpepper.png",
      blurb: "Classic garlic warmth with bright pepper finish for daily use.",
      ecwidProductId: 808797435
    },
    {
      key: "fajita-mexican",
      title: "Fajita",
      story: STORY["fajita"],
      ingredients: INGREDIENTS["fajita"],
      category: "Pouches",
      price: null,
      image: "assets/images/pouches/fajita.png",
      blurb: "Vibrant spice built for true fajitas, grilled meats, and tacos.",
      ecwidProductId: 808804349
    },
    {
      key: "chophouse-steak-rub",
      title: "Chop House Steak",
      story: STORY["chop-house-steak"],
      ingredients: INGREDIENTS["chop-house-steak"],
      category: "Pouches",
      price: null,
      image: "assets/images/pouches/chophouse.png",
      blurb: "Steakhouse profile for ribeye, strip, burgers, and roast beef.",
      ecwidProductId: 808797916
    },
    {
      key: "asian-stir-fry",
      title: "Asian Stir Fry",
      story: STORY["asian-stir-fry"],
      ingredients: INGREDIENTS["asian-stir-fry"],
      category: "Pouches",
      price: null,
      image: "assets/images/pouches/asian.png",
      blurb: "Umami-driven blend for seafood, stir-fry, noodles, and sauces.",
      ecwidProductId: 808797914
    },
    {
      key: "all-purpose",
      title: "Universal All Purpose",
      story: STORY["all-purpose"],
      ingredients: INGREDIENTS["all-purpose"],
      category: "Pouches",
      price: null,
      image: "assets/images/pouches/AP-.png",
      blurb: "Universal coverage for proteins, vegetables, eggs, and sides.",
      ecwidProductId: 808804341
    },
    {
      key: "sugar-free-all-purpose",
      title: "Sugar Free All Purpose",
      story: STORY["sugar-free-all-purpose"],
      ingredients: INGREDIENTS["sugar-free-all-purpose"],
      category: "Pouches",
      price: null,
      image: "assets/images/pouches/sugarfree.png",
      blurb: "Clean flavor architecture with no sugar added. Everyday staple.",
      ecwidProductId: 808797434
    },
    {
      key: "smoke-bbq",
      title: "Smoke BBQ",
      story: STORY["smoke-bbq"],
      ingredients: INGREDIENTS["smoke-bbq"],
      category: "Pouches",
      price: null,
      image: "assets/images/pouches/smoke.png",
      blurb: "Competition-style smoke depth for brisket, ribs, and chicken.",
      ecwidProductId: 808797919
    },

    // ===============================
    // Bottles (Category ID 194307019)
    // ===============================
    {
      key: "bottle-all-purpose",
      title: "Universal All Purpose (Bottle)",
      story: STORY["all-purpose"],
      ingredients: INGREDIENTS["all-purpose"],
      category: "Bottles",
      price: null,
      image: "assets/images/bottles/universal-all-purpose.png",
      blurb: "Heritage bottle format.",
      ecwidProductId: 367971975
    },
    {
      key: "bottle-jerk",
      title: "Jerk (Bottle)",
      story: STORY["jerk"],
      ingredients: INGREDIENTS["jerk"],
      category: "Bottles",
      price: null,
      image: "assets/images/bottles/jerk.png",
      blurb: "Heritage bottle format.",
      ecwidProductId: 367971976
    },
    {
      key: "bottle-sugar-free-all-purpose",
      title: "Sugar Free All Purpose (Bottle)",
      story: STORY["sugar-free-all-purpose"],
      ingredients: INGREDIENTS["sugar-free-all-purpose"],
      category: "Bottles",
      price: null,
      image: "assets/images/bottles/sugar-free-universal-all-purpose.png",
      blurb: "Heritage bottle format.",
      ecwidProductId: 367971972
    },
    {
      key: "bottle-deep-blue-seafood",
      title: "Deep Blue Seafood (Bottle)",
      story: STORY["deep-blue-seafood"],
      ingredients: INGREDIENTS["deep-blue-seafood"],
      category: "Bottles",
      price: null,
      image: "assets/images/bottles/deep-blue-seafood.png",
      blurb: "Heritage bottle format.",
      ecwidProductId: 367971970
    },
    {
      key: "bottle-garlic-pepper",
      title: "Garlic Pepper (Bottle)",
      story: STORY["garlic-pepper"],
      ingredients: INGREDIENTS["garlic-pepper"],
      category: "Bottles",
      price: null,
      image: "assets/images/bottles/garlic-pepper.png",
      blurb: "Heritage bottle format.",
      ecwidProductId: 367971973
    },
    {
      key: "bottle-asian-stir-fry",
      title: "Kitchen Samurai Asian Seasoning (Bottle)",
      story: STORY["asian-stir-fry"],
      ingredients: INGREDIENTS["asian-stir-fry"],
      category: "Bottles",
      price: null,
      image: "assets/images/bottles/asian.png",
      blurb: "Heritage bottle format.",
      ecwidProductId: 367971974
    },
    {
      key: "bottle-chophouse-steak",
      title: "Chop House Steak (Bottle)",
      story: STORY["chop-house-steak"],
      ingredients: INGREDIENTS["chop-house-steak"],
      category: "Bottles",
      price: null,
      image: "assets/images/bottles/chophouse-steak.png",
      blurb: "Heritage bottle format.",
      ecwidProductId: 367971978
    },
    {
      key: "bottle-smoke-bbq",
      title: "Smoke BBQ (Bottle)",
      story: STORY["smoke-bbq"],
      ingredients: INGREDIENTS["smoke-bbq"],
      category: "Bottles",
      price: null,
      image: "assets/images/bottles/smoke-bbq.png",
      blurb: "Heritage bottle format.",
      ecwidProductId: 367978765
    },
    {
      key: "bottle-fajita",
      title: "Fajita Taco (Bottle)",
      story: STORY["fajita"],
      ingredients: INGREDIENTS["fajita"],
      category: "Bottles",
      price: null,
      image: "assets/images/bottles/fajita.png",
      blurb: "Heritage bottle format.",
      ecwidProductId: 479646759
    },

    // ==========================================
    // Individual Spices (Category ID 147546336)
    // Now includes: blurb + story + ingredients
    // ==========================================
    {
      key: "worcestershire-powder",
      title: "Worcestershire Powder",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/worcestershire-powder.png",
      blurb: "Savory depth with tangy complexity for sauces and rubs.",
      story: "Worcestershire Powder delivers the bold, savory character of the classic sauce in a dry, versatile form.",
      ingredients: "Vinegar Powder, Molasses Powder, Tamarind, Garlic, Onion, Spices",
      ecwidProductId: 540163144
    },
    {
      key: "white-pepper",
      title: "White Pepper",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/white-pepper.png",
      blurb: "Smooth heat with a clean pepper finish.",
      story: "White pepper offers subtle heat and refined flavor, ideal for lighter sauces and delicate dishes.",
      ingredients: "White Pepper",
      ecwidProductId: 540400723
    },
    {
      key: "turmeric",
      title: "Turmeric",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/turmeric.png",
      blurb: "Earthy warmth with vibrant golden color.",
      story: "Turmeric adds depth, warmth, and color to dishes ranging from rice to marinades.",
      ingredients: "Turmeric",
      ecwidProductId: 540343805
    },
    {
      key: "smoked-salt",
      title: "Smoked Salt",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/smoked-salt.png",
      blurb: "Naturally smoked salt for instant fire-kissed flavor.",
      story: "Smoked Salt brings subtle wood smoke character to finished dishes and grilled foods.",
      ingredients: "Smoked Sea Salt",
      ecwidProductId: 540504929
    },
    {
      key: "smoked-paprika",
      title: "Smoked Paprika",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/smoked-paprika.png",
      blurb: "Warm, smoky sweetness for meats and vegetables.",
      story: "Smoked Paprika delivers deep color and balanced smoke without overpowering heat.",
      ingredients: "Smoked Paprika",
      ecwidProductId: 540169807
    },
    {
      key: "sea-salt",
      title: "Sea Salt",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/sea-salt.png",
      blurb: "Pure, clean salt for everyday cooking.",
      story: "Sea Salt provides clean salinity and texture essential for balanced seasoning.",
      ingredients: "Sea Salt",
      ecwidProductId: 540343708
    },
    {
      key: "soy-sauce-powder",
      title: "Soy Sauce Powder",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/soy-sauce-powder.png",
      blurb: "Umami-rich seasoning in dry form.",
      story: "Soy Sauce Powder adds savory depth without liquid, perfect for rubs and dry blends.",
      ingredients: "Soy Sauce Powder",
      ecwidProductId: 540159417
    },
    {
      key: "vinegar-powder",
      title: "Vinegar Powder",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/vinegar-powder.png",
      blurb: "Bright acidity without moisture.",
      story: "Vinegar Powder delivers tangy balance ideal for seasoning blends and snacks.",
      ingredients: "Vinegar Powder",
      ecwidProductId: 540167194
    },
    {
      key: "monk-fruit",
      title: "Monk Fruit",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/monk-fruit.png",
      blurb: "Natural sweetness with no added sugar.",
      story: "Monk Fruit provides clean sweetness without calories, ideal for sugar-free cooking.",
      ingredients: "Monk Fruit Extract",
      ecwidProductId: 540138739
    },
    {
      key: "black-pepper-chef-ground",
      title: "Black Pepper Chef Ground",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/black-pepper-chef-ground.png",
      blurb: "Bold, aromatic pepper with chef-grade grind.",
      story: "Chef Ground Black Pepper delivers balanced heat and aroma for professional kitchens.",
      ingredients: "Black Pepper",
      ecwidProductId: 540370365
    },
    {
      key: "mustard-powder",
      title: "Mustard Powder",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/mustard-powder.png",
      blurb: "Sharp, tangy heat for sauces and rubs.",
      story: "Mustard Powder adds bite and depth to dry rubs and dressings.",
      ingredients: "Mustard Seed",
      ecwidProductId: 540345086
    },
    {
      key: "ground-ginger",
      title: "Ground Ginger",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/ground-ginger.png",
      blurb: "Warm spice with gentle sweetness.",
      story: "Ground Ginger adds aromatic warmth to both savory and sweet dishes.",
      ingredients: "Ginger",
      ecwidProductId: 540177996
    },
    {
      key: "allspice-ground",
      title: "Allspice Ground",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/allspice-ground.png",
      blurb: "Warm spice notes of clove, nutmeg, and pepper.",
      story: "Allspice Ground provides layered warmth commonly used in Caribbean and baking applications.",
      ingredients: "Allspice",
      ecwidProductId: 540356513
    },
    {
      key: "red-chili-powder",
      title: "Red Chili Powder",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/red-chili-powder.png",
      blurb: "Balanced heat with rich chili flavor.",
      story: "Red Chili Powder brings controlled heat and depth to spice blends and sauces.",
      ingredients: "Red Chili Pepper",
      ecwidProductId: 540449809
    },
    {
      key: "paprika",
      title: "Paprika",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/paprika.png",
      blurb: "Mild sweetness and rich red color.",
      story: "Paprika adds color, warmth, and subtle sweetness to a wide range of dishes.",
      ingredients: "Paprika",
      ecwidProductId: 540172123
    },
    {
      key: "onion-ground",
      title: "Onion Ground",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/onion-ground.png",
      blurb: "Savory onion flavor for dry applications.",
      story: "Ground Onion delivers concentrated onion flavor without moisture.",
      ingredients: "Onion",
      ecwidProductId: 540435902
    },
    {
      key: "garlic-granulate",
      title: "Garlic Granulate",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/garlic-granulate.png",
      blurb: "Bold garlic texture for rubs and blends.",
      story: "Garlic Granulate provides robust garlic flavor with visible texture.",
      ingredients: "Garlic",
      ecwidProductId: 540330126
    },
    {
      key: "cayenne-pepper",
      title: "Cayenne Pepper",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/cayenne-pepper.png",
      blurb: "Clean, sharp heat.",
      story: "Cayenne Pepper delivers focused heat for spice control.",
      ingredients: "Cayenne Pepper",
      ecwidProductId: 540449796
    },
    {
      key: "celery-seed",
      title: "Celery Seed",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/celery-seed.png",
      blurb: "Earthy, aromatic seasoning.",
      story: "Celery Seed adds savory depth commonly used in rubs and pickling blends.",
      ingredients: "Celery Seed",
      ecwidProductId: 540400707
    },
    {
      key: "curry-powder",
      title: "Curry Powder",
      category: "Individual Spices",
      price: null,
      image: "assets/images/individual-spices/curry-powder.png",
      blurb: "Warm, layered spice blend.",
      story: "Curry Powder delivers complex warmth suitable for sauces, rice, and marinades.",
      ingredients: "Turmeric, Coriander, Cumin, Spices",
      ecwidProductId: 540519815
    },

    // ===============================
    // Subscriptions
    // ===============================
    { key: "sub-monthly", title: "Monthly Subscription", category: "Subscriptions", price: null, image: null, ecwidProductId: 575076602 },
    { key: "sub-3", title: "3 Month Subscription", category: "Subscriptions", price: null, image: null, ecwidProductId: 575088085 },
    { key: "sub-6", title: "6 Month Subscription", category: "Subscriptions", price: null, image: null, ecwidProductId: 575094563 },

    // ===============================
    // Gift Sets (Category ID 195294520)
    // ===============================
    { key: "gift-9", title: "Giftset 9", category: "Gift Sets", price: null, image: "assets/images/gifts/giftset-9.png", ecwidProductId: 813068869 },
    { key: "gift-6", title: "Giftset 6", category: "Gift Sets", price: null, image: "assets/images/gifts/giftset-6.png", ecwidProductId: 813104036 },
    { key: "gift-3", title: "Giftset 3", category: "Gift Sets", price: null, image: "assets/images/gifts/giftset-3.png", ecwidProductId: 367971971 },

    // ===============================
    // Bundles
    // ===============================
    { key: "bundle-book-classic", title: "Book Classic bottle", category: "Bundles", price: null, image: null, ecwidProductId: 813104043 },
    { key: "bundle-book-two", title: "Book Two Bottles", category: "Bundles", price: null, image: null, ecwidProductId: 813104045 },
    { key: "bundle-family", title: "Family Bundle", category: "Bundles", price: null, image: null, ecwidProductId: 813068875 },

    // ===============================
    // Grills (Category ID 172323254)
    // ===============================
    { key: "lion-l60000", title: "Lion L60000", category: "Grills", price: null, image: "assets/images/lion-grills/lion-l6000.png", blurb: "Lion Premium Grills.", ecwidProductId: 690086219 },
    { key: "lion-l75000", title: "Lion L75000", category: "Grills", price: null, image: "assets/images/lion-grills/lion-l75000.png", blurb: "Lion Premium Grills.", ecwidProductId: 690086189 },

    // L90000 appears as two separate products in admin. Keep both.
    { key: "lion-l90000", title: "Lion L90000", category: "Grills", price: null, image: "assets/images/lion-grills/lion-l90000.png", blurb: "Lion Premium Grills.", ecwidProductId: 808797939 },
    { key: "lion-l90000-alt", title: "Lion L90000 (Alt Listing)", category: "Grills", price: null, image: "assets/images/lion-grills/Lion-cart.png", blurb: "Lion Premium Grills.", ecwidProductId: 690085682 },

    // L75000 cart listing
    { key: "lion-l75000-cart", title: "Lion L75000 Cart", category: "Grills", price: null, image: "assets/images/lion-grills/lion-l75000-cart.png", blurb: "Lion Premium Grills.", ecwidProductId: 808797437 },

    // ===============================
    // Books (Juniors)
    // ===============================
    { key: "book-zen-pearl-market", title: "Zen in the Pearl Market", category: "Books", price: null, image: "assets/images/Books/zen-pearl-market-cover.png", blurb: "Juniors storybook.", ecwidProductId: null },
    { key: "book-coming-soon", title: "More Books Coming", category: "Books", price: null, image: "assets/images/Books/577f7438-9523-43f5-b825-852f53c4fb73.png", blurb: "Juniors storybook.", ecwidProductId: null }
  ];

  window.PIXY_PRODUCTS = PRODUCTS;
})();
