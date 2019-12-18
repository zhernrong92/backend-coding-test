const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
  format: format.combine(format.simple()),
  transports: [
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: './logs/log-api.log',
    }),
    new transports.Console({
      level: 'debug',
    }),
  ],
});
