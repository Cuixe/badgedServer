var winston = require('winston');

const logger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.File)({name:'info', filename: 'logs/info.log' }),
        new (winston.transports.File)({name:'debug', filename: 'logs/debug.log', level:'debug' })
    ]
});

module.exports = {

    notify: function(level,message, someElse) {
        if(someElse) {
            logger.log(level, message, {anything: someElse})
        } else {
            logger.log(level, message)
        }
        
    },
    info: function(message, someElse) {
        var self = this;
        self.notify('info', message, someElse);
    },
    debug: function(message, someElse) {
        var self = this;
        self.notify('debug', message, someElse);
    },
    error: function(message, someElse) {
        var self = this;
        self.notify('error', message, someElse);
    }
}