require('winston-mongodb');
const winston = require('winston');

module.exports = function() {

    new winston.ExceptionHandler(new winston.transports.File({ filename: 'uncaughtException.log' }))
    new winston.ExceptionHandler(new winston.transports.Console({ colorize: true, prettyPrint: true }))

    new winston.RejectionHandler(new winston.transports.File({ filename: 'uncaughtException.log' }))


    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }));
};