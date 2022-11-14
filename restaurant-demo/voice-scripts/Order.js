onCreateUser(p => {
    p.userData.productItems = "";
    p.userData.orderCategories = [];
});

onVisualState((p, vs) => {
    console.info('VS:', vs);
    if(vs?.data?.product?.productItems){
        p.userData.productItemsObj = vs?.data?.product?.productItems;
        console.log("p.userData.productItemsObj:");
        console.log(JSON.stringify(p.userData.productItemsObj));
        p.userData.productItems = vs?.data?.product?.productItems.map(el=>`${el.product_name}~${el.id}`).join('|');
        console.info('productItems', p.userData.productItems);
    }
    if (vs?.data?.foodReducer?.foodItems) {
        let orderedCategories = [];
        for (const [key, value] of Object.entries(vs?.data?.foodReducer?.foodItems)) {
            orderedCategories.push(value.category);
        }
        p.userData.orderCategories = orderedCategories.filter(function(item, pos){
            return orderedCategories.indexOf(item)== pos; 
        });
    }
});

////////////////
// +get category
////////////////
const CATEGORY_ALIASES = {
    'Burger': ['burger_'],
    'Side': ['side_', 'side dish'],
    'Drink': ['drink_', 'beverage_'],
}

project.productCategories = Object.keys(CATEGORY_ALIASES).flatMap(k => CATEGORY_ALIASES[k].map(i=> i + '~' + k)).join('|');

function findProductsByCategory(p, category) {
    let products = [];
    p.userData.productItemsObj.forEach(product => {
        if (product.category === category) {
            products.push(product.id);
        } 
    });
    return products;
}

intent("(I'd|I would) (like|have|like to have) (a|) $(CATEGORY p:productCategories). (What would you recommend|)", p => {
    p.play(`A ${p.CATEGORY.label} is always a good idea!`);
    let arrProductId = findProductsByCategory(p, p.CATEGORY.label + 's');
    if (arrProductId.length > 0) {
        p.play('I can offer you:');
        arrProductId.forEach(productId => {
            p.play({command:'scroll-to-item', itemId: productId});
            p.play(project.getProductNameByID(p, productId));
        });
    } else {
        p.play(`Unfortunatelly we don't have any ${p.CATEGORY.label + 's'}`);
    }
});

//////////////////////
// +add items to order
//////////////////////
const ADD_ITEMS_SENTENCE_START_ARRAY = [
    "Add",
    "I want",
    "I want to have",
    "Get me",
    "Order",
    "I'll take",
    "I will take",
    "I'd like",
    "I would like",
    "I would like to order",
    "I'll get",
    "I will get",
    "I'll have",
    "I will have",
    "Let me have",
    "Let me get",
];


const ADD_ITEMS_SENTENCE_START_INTENT = ADD_ITEMS_SENTENCE_START_ARRAY.join('|') + '|' + 'and|';

const categoryPriority = [
    'Burgers',
    'Sides',
    'Drinks'
];

function findFirstUnorderedCategory(p) {
    for (const category of categoryPriority) {
        let hasOrdered = p.userData.orderCategories.find(orderedCategory => orderedCategory === category);
        if (!hasOrdered) {
            return category;
        }
    }
    return;
}

intent(
    `(${ADD_ITEMS_SENTENCE_START_INTENT}) (a|the|) $(NUMBER) $(ITEM u:productItems)`,
    `(${ADD_ITEMS_SENTENCE_START_INTENT}) (a|the|) $(NUMBER) $(ITEM u:productItems) $(MULT and) (a|the|) $(NUMBER) $(ITEM u:productItems)`,
    `(${ADD_ITEMS_SENTENCE_START_INTENT}) (a|the|) $(NUMBER) $(ITEM u:productItems) $(MULT and) (a|the|) $(ITEM u:productItems)`,
    `(${ADD_ITEMS_SENTENCE_START_INTENT}) (a|the|some|) $(ITEM u:productItems) $(MULT and) (a|the|) $(ITEM u:productItems|)`,
    `(${ADD_ITEMS_SENTENCE_START_INTENT}) (a|the|some|) $(ITEM u:productItems)`,
    p => {
        addItems(p, p.ITEM_, 0);
        p.play('Adding your order to the cart');
        let unorderedCategory = findFirstUnorderedCategory(p);
        let arrProductId = findProductsByCategory(p, unorderedCategory);
        if (arrProductId.length > 0) {
            p.play(`Would you like to have some ${unorderedCategory}?`);
            p.play('I can offer you:');
            arrProductId.forEach(productId => {
                p.play({command:'scroll-to-item', itemId: productId});
                p.play(project.getProductNameByID(p, productId));
            });
        }
    }
);

intent(
    `(Remove|delete|exclude) $(ITEM~ u:productItems) (from my order|from the order|from the list|)`,
    p => {
        deleteItems(p, p.ITEM_, 0);
        p.play('Updating your order');
    }
);

function addItem(p, itemId) {
    console.log(`addItem`);
    console.log(JSON.stringify(p.userData.productItemsObj));
    const item = _.find(p.userData.productItemsObj, {id: itemId});
    console.log(JSON.stringify({command: 'add-food', item }));
    p.play({command: 'add-food', item });
}

project.addItem = addItem;

async function addItems(p, items, shift) {
    for(let i = 0; i< items.length; i++){
        const itemId = items[i].label;
        const item = _.find(p.userData.productItemsObj, {id: +itemId});

        let number = p.NUMBER?.number || 1;
        console.log('Found Item: ', item, 'number', p.NUMBER);
        for(let i = 0; i< number; i++) {
            console.log(JSON.stringify({command: 'add-food', item }));
            p.userData.orderCategories.push(item.category);
            p.play({command: 'add-food', item });
        }
    }
}

async function deleteItems(p, items, shift) {
    for(let i = 0; i< items.length; i++){
        const itemId = items[i].label;
        const item = _.find(p.userData.productItemsObj, {id: +itemId});
        if(item){
            p.play({command: 'delete-food', itemId: item.id});
        }
    }
}

intent("(Open|Show|Go|Take|Navigate|Bring) (me|to|) (the|) cart",
       "(What is|What's) in the cart?",
       "What (did|have) I (order|ordered)?", p => {
    p.play({command: 'open-cart'});
    p.play("Here is your order");
});

intent( "(Go|Get|Take me|Bring me) back", p => {
    p.play({command: 'go-back'});
    p.play("Taking you back");
});

intent("(I am ready to|Ready to|I want to|Proceed to|Go to|Please) (the|) (check out|pay|payment) (step|)",
       "(Complete|Finalize) (the|) order",
       "(I have|I am|) (finished|done|ready to go)",
       "(That is|That's|This is) (all|it)", p => {
    p.play({command: 'procceed-to-pay'});
    p.play("Proceeding to the payment step");
});

intent("scroll", p => {
    p.play({command:'scroll-to-item', itemId: 4});
});