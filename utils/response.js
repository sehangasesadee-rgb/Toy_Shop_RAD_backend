
const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};

module.exports = sendResponse;
