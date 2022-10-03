# wechat-mini-program-server-sdk [Unofficial]

## Usage

```js
const WeChatSDK = require("wechat-mini-program-server-sdk");

const service = new WeChatSDK({
  appId: "appId",
  appSecret: "appSecret",
});

const res = await service.getUserPhoneNumber(code);

console.log(res.phone_info);
```
