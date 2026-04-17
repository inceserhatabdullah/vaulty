import winston from "winston";
import "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, stack, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack ? `\n${stack}` : ""}`;
    }),
  ),
  transports: [
    /* console logs */
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true })),
    }),
    /* error logs file */
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      auditFile: "logs/state/audit.json",
      level: "error",
      maxSize: "10m",
      maxFiles: "14d",
      format: winston.format.combine(winston.format.json()),
    }),
    /* all logs file */
    new winston.transports.DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      auditFile: "logs/state/audit.json",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "14d",
      format: winston.format.combine(winston.format.json()),
    }),
    // new EmailTransport({ to: 'admin@vaulty.com' })
  ],
});

export default logger;
