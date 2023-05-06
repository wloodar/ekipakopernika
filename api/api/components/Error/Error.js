function unexpectedError(message, errorCode) {
  Error.captureStackTrace(this, this.constructor);
  this.status = -1;
  this.statusCode = errorCode || 200;
  this.general = message || process.env.ERR_UNEXCEPTED;
};

module.exports = {
  unexpectedError
}