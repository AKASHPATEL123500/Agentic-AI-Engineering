import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(), // Structured logging for production
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Log errors only
    new winston.transports.File({ filename: "logs/combined.log" }), // Log everything info and above
  ],
});

// Example usage
logger.info("Application started successfully");
logger.warn("Warning: Low disk space");
logger.error("Error: Database connection failed");

export default logger;
