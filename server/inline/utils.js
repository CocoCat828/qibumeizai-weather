const crypto = require('crypto');
const fetch = require('node-fetch');

const KEY = 'e6a260a80fac4e10afae7592db883794';
const USER_ID = 'HE2004281523241387';

const $ = {
  // 封装fetch
  http(api, init = {}) {
    return fetch(api, init)
      .then(res => {
        if (res.ok) return res.json();
        return Promise.reject(res);
      })
      .catch(err => {
        let msg = '';
        switch (err.status) {
          case 404:
            msg = '404：请求的资源不存在!';
            break;
          default:
            msg = '请求失败，请稍后重试！';
            break;
        }
        return Promise.reject({
          status: err.status,
          msg
        });
      });
  },

  // 生成签名
  generateSignature(params) {
    params.username = USER_ID;
    params.t = Math.floor(Date.now() / 1000);
    let data = Object.keys(params)
      .filter(key => {
        return params[key] !== '' && key !== 'sign' && key !== 'key';
      })
      .sort()
      .map(key => {
        return `${key}=${params[key]}`;
      })
      .join('&') + KEY;
    return crypto.createHash('md5').update(data).digest('base64');
  },

  // sunrise: 日出时间
  // sunset: 日落时间
  _isNight(now, sunrise, sunset) {
    sunrise = parseInt(sunrise) + 1;
    sunset = parseInt(sunset);
    let isNight = false;
    if (now > sunset || now < sunrise) isNight = true;
    return isNight;
  }
}

/*<remove>*/
module.exports = $;
/*</remove>*/