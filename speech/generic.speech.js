const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');

exports.welcome = function (agent) {
    agent.add(`Welcome to my agent!`);
    return agent;
};

exports.fallback = function (agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
    return agent;
};

exports.testWebhook = function (agent) {
    agent.add(`This went right inside Webhook`);
    return agent;
};

exports.others = function (agent) {
    agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    agent.add(new Card({
        title: `Title: this is a card title`,
        imageUrl: imageUrl,
        text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
        buttonText: 'This is a button',
        buttonUrl: linkUrl
    })
    );
    agent.add(new Suggestion(`Quick Reply`));
    agent.add(new Suggestion(`Suggestion`));
    agent.context.set({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' } });
    return agent;
};