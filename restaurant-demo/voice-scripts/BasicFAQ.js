const HELP_HOW = [
    "What (question|questions|command|commands|) (should I|can I|do I|am I supposed to|to) (ask|say|do|give) (here|)",
    "What (question|questions|command|commands) (can|do|will) you (answer|handle|do|support|give an answer to)",
    "What (question|questions|command|commands) (is|are) (available|supported|allowed) (to be asked|) (here|)",
    "(Can you|Will you|I need|) (help|support) (me|) (please|)",
    "(Can|Should) I (ask|tell|say) (you|) (a question|something|anything)",
    "How (do|does|should|is|are|) (it|you|this|that|this thing) (supposed to|) (work|works|working|operate|function)",
    "How (do I|should I|to) use (it|you|this|that|this thing)",
    "How (do I|should I|to) (work|get an answer) (here|)",
    "How (do|can|should) I (place|make) an order (here|)?",
    "How (do|can|should) I (get|order) (food|burgers|something|anything) (here|)?"
];

const HELP_WHAT = [
    "(What is|What's) (that|it)",
    "(Who|What) are you",
    "(Do|Does) (you|it|this|that) (thing|) work"
];

const HELP_HELLO = [
    "(Hello|Hi|Hey) (there|)"
];

intent(HELP_HOW, p => {
    let page = p.visual.page;
    switch (page) {
        default:
            p.play("(Just say|Say|You can say): Add a (classic hamburger|double cheeseburger deluxe|big bacon cheeseburger) and two (bacon feasts|onion rings|fries)");
    }
});

intent(HELP_WHAT, p => {
    let page = p.visual.page;
    switch (page) {
        default:
            p.play("I am your food ordering assistant. (Just say|Say|You can say): I want (two|three) (cheeseburgers|fries) and one (diet coke|diet pepsi|unsweetened nectarine tea)");
    }
});

intent(HELP_HELLO, p => {
    let page = p.visual.page;
    switch (page) {
        default:
            p.play("Hello, I am your food ordering assistant. I will help you to order food with voice. (Just say|Say|You can say): get me a double loaded chocolate shake or greek apple sauce");
    }
});

const yesNo = context(p => {
    intent(`(yes|sure) (please)`, p => {
        if (p.state.yesCallback) {
            p.state.yesCallback(p);
        }
    });

    intent(`no (thanks)`, `I'm good`, p => {
        p.play("Got it");
    });
});

intent("test", p => {
    project.addItem(p, 1);
    p.play("test");
})

const chickenOrBeef = context(p => {
    intent(`beef`, p => {
        p.play("We recommend you Jumbo Burger. Would you like to add it to your order?");
        p.then(yesNo, { state: { yesCallback: (p) => {
            project.addItem(p, 1);
            p.play("Got it");
        }}});
    });

    intent(`chicken`, p => {
        p.play("We recommend you Chilli Crispy Chicken Sandwich. Would you like to add it to your order?");
        p.then(yesNo, { state: { yesCallback: (p) => {
            project.addItem(p, 3);
            p.play("Got it");
        }}});
    });
});

intent("What (burger|) (would|do) you recommend?", "Recommend me a burger", p => {
    p.play("Would you like chicken or beef?");
    p.then(chickenOrBeef);
});

intent(
    "What (kind|kinds|type|types|) (of|) (food|street food|items|products|) do you (have|offer|serve) (to order|)", 
    "What can I (get|order) (here|)?",
    "What is (on|in) the menu?",
    reply("We offer (different types of|) burgers, sides, desserts and much more. What would you like to get?"));

intent(
    "(Where|) do you deliver (to|)?",
    "How much (is|does) (a|the|) delivery (fee|cost|)?",
    "Is there (a|) delivery (service|option|) (available|)?", 
    reply("The delivery cost is fixed. For a simple fee of $5.95, we will deliver your order to your doorstep!"));

intent(
    "Do you (have|offer|serve|deliver) (beer|wine|alcohol)?",
    "Can I (have|get|order) (beer|wine|alcohol) (here|)?",
    reply("Unfortunately at this time we cannot offer alcohol delivery"));

intent(
    "Do you (have|offer|serve|deliver) (pizza|sushi|wok)?",
    "Can I (have|get|order) (pizza|sushi|wok) (here|)?",
    reply("Not at the moment, but we are working on extending our menu offerings and are always open to suggestions!"));

intent(
    "Are there any specials (today|)?",
    reply("A burger is always a good idea! Take a look at the Recommended section in our app."));

intent(
    "Where (can|do) I (see|find|get) (a|) (nutrition|allegen|ingredients) (information|data|facts|value)?",
    reply("Tap the item in the app to see its top ingredients, nutrition facts and allergen information"));

intent(
    "How often (can|should) I eat (fast|junk) food?",
    "Is (fast|junk) food (unhealthy|bad)?",
    "Is it (OK|safe|healthy) to eat (fast|junk) food (once a week|twice a week|every day)?",
    reply("Eating fast food once a week will not pose any harm."));

intent(
    "What is the difference between (a|) (diet coke|coke|regular coke) and (a|) (regular coke|coke|diet coke)?",
    "Is (a|) (diet coke|coke|regular coke) (better|worse) than (a|) (regular coke|coke|diet coke)?",
    reply("Diet Coke is a low-calorie and sugar-free cold beverage alternative to regular Coke."));