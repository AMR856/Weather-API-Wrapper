const HTTPStatusText = require("./HTTPStatusText");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const statusText = err.statusText || HTTPStatusText.FAIL;
  res.status(statusCode).json({
    status: statusText,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
