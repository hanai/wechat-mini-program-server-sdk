const axios = require("axios");
const ServiceError = require("./ServiceError");

let expiresAt;
let accessToken;

const simpleGetAccessToken = async (opts) => {
  const { appId, appSecret } = opts;

  const now = Date.now();

  if (now < expiresAt && accessToken) {
    return accessToken;
  }

  const { data } = await axios.get(`https://api.weixin.qq.com/cgi-bin/token`, {
    params: {
      grant_type: "client_credential",
      appid: appId,
      secret: appSecret,
    },
  });

  if (data && typeof data.errcode === "number" && data.errcode !== 0) {
    throw new ServiceError("Failed to get access token", { data });
  } else {
    accessToken = data.access_token;
    expiresAt = now + data.expires_in * 1000;
    return accessToken;
  }
};

module.exports = simpleGetAccessToken;
