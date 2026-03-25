export const logger = {
  info(message, metadata = {}) {
    console.info(JSON.stringify({ level: "info", message, ...metadata }));
  },
  error(message, metadata = {}) {
    console.error(JSON.stringify({ level: "error", message, ...metadata }));
  },
};
