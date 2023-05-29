import fs from 'fs';
import winston from 'winston';
import 'winston-daily-rotate-file';

const logDir = `${process.cwd()}\\logs`;

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all:true
    }),
    winston.format.label({
        label:'[LOGGER]'
    }),
    winston.format.timestamp({
        format:"YY-MM-DD HH:mm:ss"
    }),
    winston.format.printf(
        info => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
    )
);

const fileLogger = winston.createLogger({
    transports: [
        new winston.transports.File({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }), 
                winston.format.simple()
            ),
            filename: `${logDir}\\error.log`, 
            level: 'error' 
        }),
        new winston.transports.DailyRotateFile({
            level: 'info',
            filename: `${logDir}\\application-%DATE%.log`,
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ],
    exceptionHandlers: [
        // new winston.transports.File({ filename: 'exceptions.log' })
        new winston.transports.Console()
    ]
});

if (Boolean(process.env.LOG_TO_CONSOLE)) {
    fileLogger.add(new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), alignColorsAndTime)
    }));
}

fileLogger.on('error', (error) => {
    console.error("Error logging to file: ", error);
});

export default fileLogger;