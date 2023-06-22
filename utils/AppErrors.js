class AppError extends Error {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // we will test on this.isOpretional later on to only send error that was produced by this class
    // other error might be way to chaotic to send to users

    Error.captureStackTrace(this, this.constructor);
  }
}
//check the code above

module.exports = AppError;
