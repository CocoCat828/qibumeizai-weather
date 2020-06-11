const QQ_MAP_KEY = 'N3EBZ-EVP3K-S34JD-ACOIE-CF4IQ-KUFP6';

wx.cloud.init({
  env: 'test-k3x06'
});

//逆地址查询
export const geocoder = (lat, lon, success = () => {}, fail = () => {}) => {
  return wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      location: `${lat},${lon}`,
      key: QQ_MAP_KEY
    },
    success,
    fail
  });
};

// 获取实时天气
export const getWeather = (lat, lon) => {
  return wx.cloud.callFunction({
    name: 'he-weather',
    data: {
      lat,
      lon
    }
  });
};

// 获取实时空气质量
export const getAir = (city) => {
  return wx.cloud.callFunction({
    name: 'he-air',
    data: { city }
  });
};