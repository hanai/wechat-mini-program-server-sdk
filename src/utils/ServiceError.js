class ServiceError extends Error {
  constructor(data) {
    super(`Failed to call ${data.url}`);
    this.data = data;
  }
}

module.exports = ServiceError;
