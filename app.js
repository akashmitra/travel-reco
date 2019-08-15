const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const logger = require('./config/log4js/log-config');

const port = process.env.PORT || 8080;

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

/** Module Imports */
const search = require('./models/search/findResort');


/** Service to find all */
app.get('/', (req, res) => {
    search.findAll((err, placeArr) => {
        if (err) logger.trace(err);
        else res.send({ place: placeArr });
    });
});

/** Service to find places by State name */
app.post('/findbyState', (req, res) => {
    let params = { statename: req.body.statename };
    search.findPlaceByState(params, (err, placeArr) => {
        res.setHeader('Content-Type', 'application/json');
        if (err) res.send({ status: "Failed" });
        else res.send({ places: placeArr });
    });
});

/** Service to find tourist attraction by Hotel Name */
app.post('/findTouristAttractionbyHotel', (req, res) => {
    let params = { hotelname: req.body.hotelname };
    search.findAttractionByHotel(params, (err, touristAttractArr) => {
        res.setHeader('Content-Type', 'application/json');
        if (err) res.send({ status: "Failed" });
        else res.send({ places: touristAttractArr });
    });
});

/** Service to find resorts in a c Category, to be visited in s Season, sorted by rating */
app.post('/findByCategoryandSeason', (req, res) => {
    let params = {
        category: req.body.category,
        season: req.body.season
        //sortbyrating: sortbyrating
    };
    search.findResortByCategoryAndSeason(params, (err, resortArr) => {
        res.setHeader('Content-Type', 'application/json');
        if (err) res.send({ status: "Failed" });
        else res.send({ places: resortArr });
    });
});

/** Service to find resorts in a c Category, in budget b, with facility f, sorted by rating r */
app.post('/findByCategoryBudgetFacilityRating', (req, res) => {
    let params = {
        category: req.body.category,
        budget: req.body.budget,
        facility: req.body.facility,
        rating: req.body.rating
    };
    search.findByCategoryBudgetFacilityRating(params, (err, resortArr) => {
        res.setHeader('Content-Type', 'application/json');
        if (err) res.send({ status: "Failed" });
        else res.send({ places: resortArr });
    });
});


// Creating a Server
http.createServer(app).listen(port, () => {
    logger.trace(`Server started on Port ${port}`);
});

module.exports = app;