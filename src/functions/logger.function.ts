import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize } = winston.format;

const format = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack ? `\n${stack}` : ""}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format,
  ),
  transports: [
    /* console logs */
    new winston.transports.Console({
      format: combine(colorize(), format),
    }),
    /* error logs file */
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      auditFile: "logs/state/audit.json",
      level: "error",
      maxSize: "1m",
      maxFiles: "14d",
    }),
    /* all logs file */
    new winston.transports.DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      auditFile: "logs/state/audit.json",
      datePattern: "YYYY-MM-DD",
      maxSize: "1m",
      maxFiles: "14d",
    }),
    // new EmailTransport({ to: 'admin@vaulty.com' })
  ],
});

export default logger;
