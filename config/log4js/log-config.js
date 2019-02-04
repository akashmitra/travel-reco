(function () {
    var log4js = require('log4js');

    //log the cheese logger messages to a file, and the console ones as well.
    log4js.configure({
        appenders: [{
            type: "file",
            filename: "dev.log",
            category: ['develop', 'console']
        }, {
            type: "console"
        }],
        replaceConsole: true
    });

    //Create a logger instance
    var logger = log4js.getLogger('develop');
    logger.setLevel('TRACE');

    //export the instance
    module.exports = logger;

}());

