// 请求地址
const API_URL = 'https://free-api.heweather.net/s6/weather';

/*<jdists import="../../inline/utils.js" />*/

/*<remove>*/
const $ = require('../../inline/utils');
/*</remove>*/

//通过天气状态码获取图标名称
function getIconNameByCode(code, isNight) {
  const nightMap = {
    '100': 'qingye',
    '200': 'qingye',
    '201': 'qingye',
    '202': 'qingye',
    '203': 'qingye',
    '204': 'qingye',
    '101': 'duoyunye',
    '102': 'duoyunye',
    '103': 'duoyunye',
    '300': 'zhenyuye',
    '301': 'zhenyuye',
    '302': 'zhenyuye',
    '303': 'zhenyuye',
    '304': 'zhenyuye',
    '305': 'zhenyuye',
    '306': 'zhenyuye',
    '307': 'zhenyuye',
    '308': 'zhenyuye',
    '309': 'zhenyuye',
    '310': 'zhenyuye',
    '311': 'zhenyuye',
    '312': 'zhenyuye',
    '313': 'zhenyuye',
    '314': 'zhenyuye',
    '315': 'zhenyuye',
    '316': 'zhenyuye',
    '399': 'zhenyuye',
    '317': 'zhenyuye',
    '318': 'zhenyuye',
    '400': 'zhenxueye',
    '401': 'zhenxueye',
    '402': 'zhenxueye',
    '403': 'zhenxueye',
    '404': 'zhenxueye',
    '405': 'zhenxueye',
    '406': 'zhenxueye',
    '407': 'zhenxueye',
    '408': 'zhenxueye',
    '409': 'zhenxueye',
    '410': 'zhenxueye',
    '499': 'zhenxueye'
  }
  const dayMap = {
    '100': 'qingbai',
    '101': 'duoyunbai',
    '102': 'duoyunbai',
    '103': 'duoyunbai',
    '104': 'yin',
    '201': 'qingye',
    '202': 'qingye',
    '203': 'qingye',
    '204': 'qingye',
    '205': 'fengli',
    '206': 'fengli',
    '207': 'fengli',
    '208': 'fengli',
    '209': 'yin',
    '210': 'yin',
    '211': 'yin',
    '212': 'yin',
    '213': 'yin',

    '300': 'zhenyubai',
    '301': 'zhenyubai',
    '302': 'leizhenyu',
    '303': 'leizhenyu',
    '304': 'leizhenyuzhuanbingbao',
    '305': 'xiaoyu',
    '306': 'zhongyu',
    '307': 'dayu',
    '308': 'tedabaoyu',
    '309': 'xiaoyu',
    '310': 'baoyu',
    '311': 'dabaoyu',
    '312': 'tedabaoyu',
    '313': 'dongyu',
    '314': 'xiaoyu',
    '315': 'zhongyu',
    '316': 'dayu',
    '317': 'baoyu',
    '318': 'dabaoyu',
    '399': 'xiaoyu',

    '400': 'xiaoxue',
    '401': 'zhongxue',
    '402': 'daxue',
    '403': 'baoxue',
    '404': 'yujiaxue',
    '405': 'yujiaxue',
    '406': 'yujiaxue',
    '407': 'zhenxuebai',
    '408': 'xiaoxue',
    '409': 'zhongxue',
    '410': 'daxue',
    '499': 'xiaoxue',

    '500': 'wu',
    '501': 'wu',
    '502': 'wumaibai',
    '503': 'yangsha',
    '504': 'yangsha',
    '507': 'shachenbao',
    '508': 'qiangshachenbao',
    '509': 'wu',
    '510': 'wu',
    '511': 'wumaibai',
    '512': 'wumaibai',
    '513': 'wumaibai',
    '514': 'wu',
    '515': 'wu',

    '900': 'qingbai',
    '901': 'qingbai',
    '902': 'yin'
  }
  if (isNight && nightMap[code]) return nightMap[code];
  return dayMap[code] ? dayMap[code] : 'yin';
}

// 获取小程序底部文字
function getOneWord() {
  const list = [
    '生活是天气，有阴有晴有风雨',
    '心怀感恩，幸福常在',
    '心累的时候，换个心情看世界',
    '想获得人生的金子，就必须淘尽生活的沙烁',
    '因为有明天，今天永远只是起跑线',
    '只要心情是晴朗的，人生就没有雨天',
    '有你的城市下雨也美丽',
    '雨划过我窗前，玻璃也在流眼泪',
    '天空澄碧，纤云不染',
    '人生，不要被安逸所控制',
    '在受伤的时候，也能浅浅的微笑',
    '不抱怨过去，不迷茫未来，只感恩现在',
    '生活向前，你向阳光',
    '在阳光中我学会欢笑，在阴云中我学会坚强'
  ];
  let index = Math.floor(Math.random() * list.length);
  return list[index] ? list[index] : list[0];
}

// 初始化当前天气信息
function initCurrentData(data, _data) {
  let {
    tmp,
    wind_dir,
    wind_sc,
    hum,
    cond_txt,
    cond_code
  } = data;
  let {
    sr,
    ss
  } = _data.daily_forecast[0];
  let hours = new Date().getUTCHours() + 8;
  let isNight = $._isNight(hours, sr, ss);
  return {
    temp: tmp,
    humidity: hum,
    wind: wind_dir,
    windLevel: wind_sc,
    weather: cond_txt,
    icon: getIconNameByCode(cond_code, isNight)
  }
}

exports.main = async (event) => {
  const { lat, lon } = event;
  let location = `${lat},${lon}`;
  let params = { location }
  // 生成签名
  params.sign = $.generateSignature(params);
  let query = []
  for (let i in params) {
    query.push(`${i}=${encodeURIComponent(params[i])}`);
  }
  let url = API_URL + '?' + query.join('&');
  return $.http(url).then(data => {
    if (data && data.HeWeather6 && data.HeWeather6[0].now) {
      let result = data.HeWeather6[0];
      let { now, daily_forecast, lifestyle, hourly } = result;
      return {
        status: 0,
        oneWord: getOneWord(),
        current: initCurrentData(now, result)
      }
    } else {
      return Promise.reject({
        status: 500,
        msg: data.HeWeather6[0].status
      });
    }
  })
}