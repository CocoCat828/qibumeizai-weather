const QQ_MAP_KEY = 'N3EBZ-EVP3K-S34JD-ACOIE-CF4IQ-KUFP6'

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
}

export const test = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/test',
      data,
      success: (res) => {
        resolve({
          result: res.data
        });
      },
      fail: reject
    });
  });
};