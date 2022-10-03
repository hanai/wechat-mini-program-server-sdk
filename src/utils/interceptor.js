const ServiceError = require("./ServiceError");

const onRequest = async function (config) {
  const accessToken = await this.getAccessToken({
    appId: this.appId,
    appSecret: this.appSecret,
  });
  config.params = {
    ...config.params,
    access_token: accessToken,
  };
  return config;
};

const onResponse = function (response) {
  if (
    response &&
    response.data &&
    typeof response.data.errcode === "number" &&
    response.data.errcode !== 0
  ) {
    throw new ServiceError({
      url: response.config.url,
      data: response.data,
      params: response.config.params,
    });
  }
  return response;
};

module.exports = {
  onResponse,
  onRequest,
};
