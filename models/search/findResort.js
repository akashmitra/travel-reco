const logger = require('../../config/log4js/log-config');
const neo4jsession = require('../../config/neo4j/neo4j-config');


/** Test and match All */
exports.findAll = cb => {
    neo4jsession
        .run('MATCH (n) RETURN n')
        .then((result) => {
            let placesArr = result.records.map(place => place._fields[0].properties);
            neo4jsession.close();
            cb(null, placesArr);
        })
        .catch(err => cb(err));
};

/** Service to find places by State name */
exports.findPlaceByState = function (params, cb) {
    let statename = params.statename;
    logger.trace(`State :: ${statename}`);
    let query = `MATCH (p:Place)-[:STATE]->(s:State) WHERE s.name='${statename}' RETURN p.name AS Destinations`;
    neo4jsession
        .run(query)
        .then((result) => {
            logger.trace('Results :: ', result);
            let placeArr = result.records.map(place => place._fields[0]);
            neo4jsession.close();
            cb(null, placeArr);
        })
        .catch((err) => cb(err));
};

/** Service to find tourist attraction by Hotel */
exports.findAttractionByHotel = function (params, cb) {
    let hotelname = params.hotelname;
    logger.trace(`State :: ${hotelname}`);
    let query = `MATCH (r:Resort)-[:PLACE]->(p:Place)<-[:ATTRACTION_IN]-(a:Attraction)
    WHERE r.name = '${hotelname}'
    RETURN a.name AS Attractions`;
    neo4jsession
        .run(query)
        .then((result) => {
            logger.trace('Results :: ', result);
            let placeArr = result.records.map(place => place._fields[0]);
            neo4jsession.close();
            cb(null, placeArr);
        })
        .catch((err) => cb(err));
};

/** Service to find resorts in a c Category, to be visited in s Season, sorted by rating */
exports.findResortByCategoryAndSeason = function (params, cb) {
    let category = params.category;
    let season = params.season;
    //let sortbyrating = params.sortbyrating;

    let query = `MATCH (r1:Resort)-[:CATEGORY]->(c:Category),
    (r1:Resort)-[:PLACE]->(p:Place),
    (p:Place)-[:BEST_SEASON]->(s:Season),
    (r1:Resort)-[:RATING]->(r2:Rating)
    WHERE c.name = '${category}' AND s.name='${season}'
    RETURN r1.name AS Resort, r2.rating AS Rating, r1.address AS Address
    ORDER BY r2.rating DESC`;
    neo4jsession
        .run(query)
        .then((result) => {
            logger.trace('Results :: ', result);
            let placeArr = result.records.map(place => place._fields[0]);
            neo4jsession.close();
            cb(null, placeArr);
        })
        .catch((err) => cb(err));
};

/** Service to find resorts in a c Category, in budget b, with facility f, sorted by rating r */
exports.findByCategoryBudgetFacilityRating = function (params, cb) {
    let category = params.category;
    let budget = params.budget;
    let facility = params.facility;
    let rating = params.rating;

    logger.trace('Budget ::', budget);

    let query = `MATCH (r1:Resort)-[:CATEGORY]->(c:Category),
    (r1:Resort)-[:RATING]->(r2:Rating),
    (r1:Resort)-[:FACILITY]->(f:Facility)
   WHERE c.name = '${category}' AND r1.avg_rate <= ${budget} AND f.name = '${facility}' AND r2.rating >= ${rating}
   RETURN r1.name AS Resort, r2.rating AS Rating, r1.avg_rate AS Rate_Per_Day
   ORDER BY r2.rating DESC`;

    logger.trace('Query ::', query);

    neo4jsession
        .run(query)
        .then((result) => {
            logger.trace('Results :: ', result);
            let placeArr = result.records.map(place => place._fields[0]);
            neo4jsession.close();
            cb(null, placeArr);
        })
        .catch((err) => cb(err));
};