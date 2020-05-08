// 请求地址
const API_URL = 'https://free-api.heweather.net/s6/air/now';

/*<jdists import="../../inline/utils.js" />*/

/*<remove>*/
const $ = require('../../inline/utils');
/*</remove>*/

// 空气质量的代表颜色
function airBackgroundColor(aqi) {
  if (aqi < 100) {
    return '#00cf9a';
  } else if (aqi < 200) {
    return '#4295f4';
  } else if (aqi > 300) {
    return '#ff6600'
  }
}

exports.main = async (event) => {
  let location = event.city;
  let params = { location };
  let query = [];
  params.sign = $.generateSignature(params);
  for (let i in params) {
    query.push(`${i}=${encodeURIComponent(params[i])}`);
  }
  let url = API_URL + '?' + query.join('&');
  return $.http(url)
    .then((data) => {
      if (data && data.HeWeather6 && data.HeWeather6[0].air_now_city) {
        let { aqi, qlty } = data.HeWeather6[0].air_now_city;
        return {
          status: 0,
          aqi,
          name: qlty,
          color: airBackgroundColor(aqi)
        }
      } else {
        return Promise.reject({
          status: 500,
          msg: data.HeWeather6[0].status
        });
      }
    }).catch((err) => {
      return Promise.reject({
        status: 500,
        msg: data.HeWeather6[0].status
      });
    });
}