/*<jdists trigger="prod">
const fetch = require('node-fetch');
</jdists>*/

// 请求地址
const API_URL = 'https://free-api.heweather.net/s6/weather';

// 引入云函数功能工具方法，跟空气质量公用
// gulp prod 打包的时候将公共 utils 库嵌入式引入
/*<jdists import="../../inline/utils.js" />*/

//普通mock-server的代码直接将 utils 库当模块引入
/*<remove>*/
const $ = require('../../inline/utils');
/*</remove>*/

exports.main = async (event) => {
  const { lat, lon } = event;
  let location = `${lat},${lon}`;
  let params = { location }
  // 生成签名
  params.sign = $.generateSignature(params);
  let query = []
  for (let i in params) {
    if (i === 'location') {
      query.push(`${i}=${params[i]}`)
    } else {
      query.push(`${i}=${encodeURIComponent(params[i])}`)
    }
  }
  let url = API_URL + '?' + query.join('&');
  return $.http(url).then(data => {
    console.log(data);
    if (data && data.HeWeather6 && data.HeWeather6[0].now) {
      let result = data.HeWeather6[0];
      let { now, daily_forecast, lifestyle, hourly } = result;
      return {
        status: 0,
        oneWord: $.getOneWord(),
        current: $._now(now, result)
      }
    }
  })
}