const PRODUCTS_INFO = {
    1: {
        description: 'is topped off with pickles, crisp shredded lettuce, finely chopped onion and American cheese for a 100% beef burger with a taste like no other',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    2: {
        description: 'are a mini-quiche mix of spicy cheeses, and topped with bacon',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    3: {
        description: 'is spicy pepper sauce topping the southern style fried chicken fillet on a toasted potato roll. This sandwich was made for those who like it crispy, juicy, tender and hot',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    4: {
        description: 'is crisp shredded lettuce and three Roma tomato slices top deliciously juicy and cooked when you order. Seasoned with just a pinch of salt and pepper and sizzled on our flat iron grill. Layered with two slices of melty American cheese, creamy mayo, slivered onions and tangy pickles on a soft, fluffy sesame seed hamburger bun',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    5: {
        description: 'is very unique and is prepared mainly with mashed potatoes and green peas. The flagship mcaloo tikki recipe from McDonalds involves a special sauce which is basically a combination of tomato sauce and mayonnaise',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    6: {
        description: 'is made with mayo on the outside for perfectly browned and crispy bread on the outside yet it was tender soft on the inside',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    7: {
        description: 'is a Two flame-grilled beef patty with crunchy pickles, yellow mustard, and ketchup on a toasted sesame seed bun',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    8: {
        description: 'is a two flame-grilled Cheese Burger with juicy tomatoes and cheese',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    9: {
        description: 'are prepared by cutting potatoes into even strips, drying them, and frying them, usually in a deep fryer. Pre-cut, blanched, and frozen russet potatoes are widely used, and sometimes baked in a regular or convection oven',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    10: {
        description: 'is a cross-sectional ring of onion dipped in batter or bread crumbs and then deep fried; a variant is made with onion paste',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    11: {
        description: 'is a food product consisting of a small piece of deboned chicken Meat that is breaded or battered, then deep-fried or baked',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    12: {
        description: 'are light and crispy bites, filled with roaster cheddar cheese',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    13: {
        description: 'is 100% Natural applesauce from all natural ingredients with no added sugar. Contains 1 full serving of fruit, is naturally',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    14: {
        description: 'is the perfect sweet treat for any time of the day. Our chocolate shake is made with delicious soft serve, chocolate syrup and finished off with a creamy whipped topping. Double Loaded Chocolate shake is available in small, medium and large',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    15: {
        description: 'combines creamy vanilla soft serve and warm, buttery caramel topping',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    16: {
        description: 'is the perfect balance of crisp + refreshing. it’s your deliciously fizzy go-to companion. the beverage you can count on. an original, just like you',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    17: {
        description: 'is the perfect balance of crisp + refreshing. it’s your deliciously fizzy go-to companion. the beverage you can count on. an original, just like you',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    18: {
        description: 'is the perfect balance of crisp + refreshing. it’s your deliciously fizzy go-to companion. the beverage you can count on. an original, just like you',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    19: {
        description: 'is special unsweetened combination of peach and nectarine flavors plus green tea that adds a delicious sparkle of nourishment to your day',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }, 
    20: {
        description: '- milk and ice all come together for a mocha flavor that will leave you wanting more. To change things up, try it affogato-style with a hot espresso shot poured right over the top',
        calories: 460,
        allergens: ['salted butter', 'cream']
    }
};

const ALLERGEN_ALIASES = {
    'salted butter': ['salted butter', 'butter'],
    'cream': ['cream'],
    'nut': ['nut_','nut_ products'],
};

project.knownAllergens = Object.keys(ALLERGEN_ALIASES).flatMap(k => ALLERGEN_ALIASES[k].map(i=> i + '~' + k)).join('|');

let caloriesCtx = context(() => {
    intent(
        "(What is|What's) (the|its) (caloric|calories) value (of it|of this burger|)?",
        "(What is|What's) (the|) number of calories (in|) (it|this burger|)?",
        "How many calories (are there|does it have|does it contain|are in this burger)?",
        p => {
            p.play(`Only ${p.userData.curProductInfo.calories} calories per serving.`);
        }
    )
});

let allergensCtx = context(() => {
    intent(
        '(Where|How) (do I|to|is) (find|check|see|get|) (the|) (allergen|allergy) (information|data|info)? I (am allergic|have an allergy|am sensible) to $(KNOWN_ALLERGEN p:knownAllergens)', 
        '(Where|How) (do I|to|is) (find|check|see|get) (the|) (allergen|allergy) (information|data|info)? I have $(KNOWN_ALLERGEN p:knownAllergens) (allergy|sensitivity)',
        'Is there (the|) (allergen|allergy) (information|data|info) (posted|available|) (anywhere|)? I (am allergic|have an allergy|am sensible) to $(KNOWN_ALLERGEN p:knownAllergens)', 
        'Is there (the|) (allergen|allergy) (information|data|info) (posted|available|) (anywhere|)? I have $(KNOWN_ALLERGEN p:knownAllergens) (allergy|sensitivity)',
        'I (am allergic|have an allergy|am sensible) to $(KNOWN_ALLERGEN p:knownAllergens)',
        'I have $(KNOWN_ALLERGEN p:knownAllergens) (allergy|sensitivity)',
        p => {
            let productName = getProductNameByID(p, p.userData.curProductId);
            let containAllergen = _.includes(p.userData.curProductInfo.allergens, p.KNOWN_ALLERGEN.label);
            if (containAllergen) {
                p.play(`(Yes,|) ${productName} contains ${p.KNOWN_ALLERGEN.label} or ${p.KNOWN_ALLERGEN.label} products. If you are allergic to this ingredient, (you are advised not to choose it| try choosing something else from our menu)`);
            } else {
                let allergensString = '';
                let curProductAllergens = p.userData.curProductInfo.allergens;
                let lastAllergen = curProductAllergens[curProductAllergens.length - 1];
                if (curProductAllergens.length > 1) {
                    curProductAllergens.splice(curProductAllergens.length - 1, 1);
                    console.log('length:', curProductAllergens.length);
                    if (curProductAllergens.length > 1) {
                        allergensString += curProductAllergens.join(', ');
                    } else {
                        allergensString += curProductAllergens[0];
                    }
                    allergensString += ' and ' + lastAllergen;
                } else {
                    allergensString = curProductAllergens[0];
                }
                p.play(`No ${p.KNOWN_ALLERGEN.label} in ${productName}, take a note that it is made with other allergens like ${allergensString}`);
            }
        }
    )
});

function getProductNameByID (p, id) {
    return _.find(p.userData.productItemsObj, {id: id}).product_name;
}

project.getProductNameByID = getProductNameByID;

projectAPI.getProductInfo = function(p, param, callback) {
    const productId = +param.productId;

    console.log('getProductInfo method was called with productId:', productId);

    const product = _.find(p.userData.productItemsObj, {id: productId});
    const productInfo = PRODUCTS_INFO[productId];

    p.userData.curProductInfo = productInfo;
    p.userData.curProductId = productId;

    console.log('Found product:', product, 'found info:', p.userData.curProductInfo);

    if(product && productInfo){
        p.play(`${product.product_name} ${productInfo.description}`);
        p.then(caloriesCtx);
        p.then(allergensCtx);
    }
};