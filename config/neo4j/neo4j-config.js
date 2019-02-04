(function () {

    const neo4j = require('neo4j-driver').v1;
    const neo4jdetails = require('./neo4j-creds.json');

    const driver = neo4j.driver(neo4jdetails.driverurl, neo4j.auth.basic(neo4jdetails.username, neo4jdetails.password));

    module.exports = driver.session();

}());