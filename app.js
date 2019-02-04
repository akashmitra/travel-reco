const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const logger = require('./config/log4js/log-config');

const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');

const port = process.env.PORT || 8080;
process.env.DEBUG = 'dialogflow:debug';

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

/** Module Imports */
const search = require('./models/search/findResort');
const generalspeech = require('./speech/generic.speech');


/** Handler for Dialogflow */
app.post('/dialogflow', (request, response) => {

    const agent = new WebhookClient({ request: request, response: response });
    logger.trace('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    logger.trace('Dialogflow Request body: ' + JSON.stringify(request.body));

    function googleAssistantOther(agent) {
        let conv = agent.conv(); // Get Actions on Google library conversation object
        conv.ask('Please choose an item:');
        conv.ask(new Carousel({
            title: 'Google Assistant',
            items: {
                'WorksWithGoogleAssistantItemKey': {
                    title: 'Works With the Google Assistant',
                    description: 'If you see this logo, you know it will work with the Google Assistant.',
                    image: {
                        url: imageUrl,
                        accessibilityText: 'Works With the Google Assistant logo',
                    },
                },
                'GoogleHomeItemKey': {
                    title: 'Google Home',
                    description: 'Google Home is a powerful speaker and voice Assistant.',
                    image: {
                        url: imageUrl2,
                        accessibilityText: 'Google Home'
                    },
                },
            },
        }));
        agent.add(conv);
    }

    function welcome(agent) {
        generalspeech.welcome(agent);
    }

    function fallback(agent) {
        generalspeech.fallback(agent);
    }

    function testWebhook(agent) {
        generalspeech.testWebhook(agents);
    }

    function other(agent) {
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
    }

    
    // Dialogflow intent Function Mapping
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('TestWebhook', testWebhook);

    // Intent Error Handling: If req from Google Assistant use fn(googleAssistantOther) else fn(other)
    if (agent.requestSource === agent.ACTIONS_ON_GOOGLE) {
        intentMap.set(null, googleAssistantOther);
    } else {
        intentMap.set(null, other);
    }
    agent.handleRequest(intentMap);
});


/** Service to find all */
// app.get('/', function (req, res) {
//     search.findAll(req, function (personArr) {
//         res.send({
//             persons: personArr
//         });
//     });
// });

/** Service to find places by State name */
// search.findPlaceByState(req, function () {
//     res.setHeader('Content-Type', 'application/json');
//     res.send({
//         places: placeArr
//     });
// });

/** Service to find tourist attraction by Hotel Name */
// search.findAttractionByHotel(req, function () {
//     res.setHeader('Content-Type', 'application/json');
//     res.send({
//         places: touristAttractArr
//     });
// });

/** Service to find resorts in a c Category, to be visited in s Season, sorted by rating */
// search.findResortByCategoryAndSeason(req, function () {
//     res.setHeader('Content-Type', 'application/json');
//     res.send({
//         places: resortsArr
//     });
// });

/** Service to find resorts in a c Category, in budget b, with facility f, sorted by rating r */
// search.findResortBycbfr(req, function () {
//     res.setHeader('Content-Type', 'application/json');
//     res.send({
//         places: resortsArr
//     });
// });

// Creating a Server
http.createServer(app).listen(port, () => {
    logger.trace('Server started on Port 3000');
});

module.exports = app;