const axios = require("axios");
const simpleGetAccessToken = require("./utils/accessToken");
const interceptor = require("./utils/interceptor");

class Client {
  constructor(opts) {
    this.getAccessToken = opts.getAccessToken || simpleGetAccessToken;
    this.appId = opts.appId;
    this.appSecret = opts.appSecret;

    const httpClient = axios.create();
    httpClient.interceptors.request.use(
      interceptor.onRequest.bind(this),
      (error) => Promise.reject(error)
    );
    httpClient.interceptors.response.use(
      interceptor.onResponse.bind(this),
      (error) => Promise.reject(error)
    );
    this.httpClient = httpClient;
  }

  /**
   * 小程序登录
   */
  async code2session(code) {
    const { data } = await axios.get(
      "https://api.weixin.qq.com/sns/jscode2session",
      {
        params: {
          appid: this.appId,
          secret: this.appSecret,
          js_code: code,
          grant_type: "authorization_code",
        },
      }
    );
    return data;
  }

  /**
   * 获取手机号
   */
  async getUserPhoneNumber(code) {
    const { data } = await this.httpClient.post(
      `https://api.weixin.qq.com/wxa/business/getuserphonenumber`,
      {
        code,
      }
    );
    return data;
  }

  /**
   * 文本内容安全识别
   * @param {Object} args
   * @param {string} args.content - 需检测的文本内容
   * @param {string} args.openid - 用户的openid（用户需在近两小时访问过小程序）
   * @param {number} args.scene - 场景枚举值（1 资料；2 评论；3 论坛；4 社交日志）
   * @param {number} [args.version=2] - 接口版本号
   * @param {string} [args.title] - 文本标题
   * @param {string} [args.nickname] - 用户昵称
   * @param {string} [args.signature] - 个性签名，该参数仅在资料类场景有效(scene=1)
   */
  async msgSecurityCheck(args) {
    const { data } = await this.httpClient.post(
      "https://api.weixin.qq.com/wxa/msg_sec_check",
      {
        version: 2,
        ...args,
      }
    );
    return data;
  }

  /**
   * 音视频内容安全识别
   * @param {Object} args
   * @param {string} args.mediaUrl - 要检测的图片或音频的url
   * @param {number} args.mediaType - 1:音频;2:图片
   * @param {number} [args.version=2] - 接口版本号
   * @param {number} args.scene - 场景枚举值（1 资料；2 评论；3 论坛；4 社交日志）
   * @param {string} args.openid - 用户的openid（用户需在近两小时访问过小程序）
   */
  async mediaCheckAsync(args) {
    const { data } = await this.httpClient.post(
      "https://api.weixin.qq.com/wxa/media_check_async",
      {
        media_url: args.mediaUrl,
        media_type: args.mediaType,
        version: args.version || 2,
        scene: args.scene,
        openid: args.openid,
      }
    );
    return data;
  }
}

module.exports = Client;
