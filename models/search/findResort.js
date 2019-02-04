const logger = require('../../config/log4js/log-config');
const neo4jsession = require('../../config/neo4j/neo4j-config');


exports.findAll = function (req, cb) {
    neo4jsession
        .run('MATCH (n) RETURN n')
        .then(function (result) {
            let personArr = [];
            result.records.forEach(function (record) {
                personArr.push(record._fields[0].properties);
            });
            neo4jsession.close();
            cb(personArr);
        })
        .catch(function (err) {
            logger.trace(err);
        });
};

/** Service to find places by State name */
exports.findPlaceByState = function (req, cb) {

    let statename = req.body.state;
    logger.trace('State :: ', statename);
    let query = "MATCH (p:Place)-[:STATE]->(" + statename + ") RETURN p.name AS Destinations";
    session
        .run(query)
        .then(function (result) {
            logger.trace('Results :: ', result);
            var placeArr = [];
            result.records.forEach(function (record) {
                placeArr.push({
                    name: record._fields[0]
                });
            });
            session.close();
            cb(placeArr);
        })
        .catch(function (err) {
            logger.trace(err);
        });
};

/** Service to find tourist attraction by Hotel Name */
exports.findAttractionByHotel = function (req, cb) {
    let hotelname = req.body.hotelname;
    logger.trace('Hotel Name :: ', hotelname);
    session
        .run(`MATCH (r:Resort)-[:PLACE]->(p:Place)<-[:ATTRACTION_IN]-(a:Attraction)
              WHERE r.name = '${hotelname}'
              RETURN a.name AS Attractions`, { hotelname: hotelname })
        .then(function (result) {
            logger.trace('Results :: ', result);
            var touristAttractArr = [];
            result.records.forEach(function (record) {
                touristAttractArr.push({
                    name: record._fields[0]
                });
            });
            session.close();
            cb(touristAttractArr);
        })
        .catch(function (err) {
            logger.trace(err);
        });
};

/** Service to find resorts in a c Category, to be visited in s Season, sorted by rating */
exports.findResortByCategoryAndSeason = function (req, cb) {
    let category = req.body.category;
    let season = req.body.season;

    session
        .run(`MATCH (r1:Resort)-[:CATEGORY]->(c:Category),
                    (r1:Resort)-[:PLACE]->(p:Place),
                    (p:Place)-[:BEST_SEASON]->(s:Season),
                    (r1:Resort)-[:RATING]->(r2:Rating)
                    WHERE c.name = '${category}' AND s.name='${season}'
                    RETURN r1.name AS Resort, r2.rating AS Rating, r1.address AS Address
                    ORDER BY r2.rating DESC`,
            { category: category, season: season })
        .then(function (result) {
            logger.trace('Results :: ', result);
            var resortsArr = [];
            result.records.forEach(function (record) {
                resortsArr.push({
                    name: record._fields[0]
                });
            });
            session.close();
            cb(resortsArr);
        })
        .catch(function (err) {
            logger.trace(err);
        });
};

/** Service to find resorts in a c Category, in budget b, with facility f, sorted by rating r */
exports.findResortBycbfr = function () {

    let category = req.body.category;
    let budget = req.body.budget;
    let facility = req.body.facility;
    let rating = req.body.rating;

    session
        .run(`MATCH (r1:Resort)-[:CATEGORY]->(c:Category),
                        (r1:Resort)-[:RATING]->(r2:Rating),
                        (r1:Resort)-[:FACILITY]->(f:Facility)
                    WHERE c.name = '${category}' AND r1.avg_rate <= ${budget} AND f.name = '${facility}' AND r2.rating >= ${rating}
                    RETURN r1.name AS Resort, r2.rating AS Rating, r1.avg_rate AS Rate_Per_Day
                    ORDER BY r2.rating DESC`,
            { category: category, budget: budget, facility: facility, rating: rating })
        .then(function (result) {
            logger.trace('Results :: ', result);
            var resortsArr = [];
            result.records.forEach(function (record) {
                resortsArr.push({
                    name: record._fields[0]
                });
            });
            session.close();
            cb(resortsArr);
        })
        .catch(function (err) {
            logger.trace(err);
        });
};