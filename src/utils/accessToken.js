const axios = require("axios");

let expiresAt;
let accessToken;

const simpleGetAccessToken = async (opts) => {
  const { appId, appSecret } = opts;

  if (Date.now() < expiresAt && accessToken) {
    return accessToken;
  }

  const { data } = await axios.get(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  );

  if (data.access_token && data.expires_in) {
    accessToken = data.access_token;
    expiresAt = Date.now() + data.expires_in;
    return accessToken;
  } else {
    throw data;
  }
};

module.exports = simpleGetAccessToken;
