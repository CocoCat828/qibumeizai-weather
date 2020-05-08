/*<remove trigger="prod">*/
import { geocoder } from '../../libs/api';
import { getWeather } from '../../libs/api-mock';
/*</remove>*/

/*<jdists trigger="prod">
import { geocoder, getWeather } from '../../libs/api';
</jdists>*/

Page({
  data: {
    width: 375,
    scale: 1,
    backgroundImage: '../../images/cloud.jpg',
    backgroundColor: '#62aadc',
    current: {
      temp: 0,
      weather: '数据获取中',
      humidity: '1',
      icon: 'xiaolian'
    },
    oneWord: '',
    lat: 40.058090,
    lon: 116.312336,
    province: '北京市',
    city: '北京市',
    county: '海淀区',
    address: '定位中'
  },

  // 获取定位信息
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: this.updateLocation,
      fail: (e) => {
        // console.log(e);
        this.openLocation();
      }
    })
  },

  // 提示打开位置权限
  openLocation() {
    wx.showToast({
      title: '检测到您未授权使用位置权限，请先开启哦',
      icon: 'none',
      duration: 3000
    });
  },

  // 选择定位的事件处理
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        let {
          latitude,
          longitude
        } = res;
        let {
          lat,
          lon
        } = this.data;
        if (latitude == lat && longitude == lon) {
          this.getWeatherData();
        } else {
          this.updateLocation(res);
        }
      }
    })
  },

  // 更新定位数据
  updateLocation(res) {
    let {
      latitude: lat,
      longitude: lon,
      name
    } = res;
    let data = {
      lat,
      lon
    }
    if (name) data.address = name;
    this.setData(data);
    this.getAddress(lat, lon, name);
  },

  // 处理逆地址，获取位置描述
  getAddress(lat, lon, name) {
    wx.showLoading({
      title: '定位中',
      mask: true
    });
    const fail = (e) => {
      this.setData({
        address: name || '北京市海淀区西二旗北路'
      });
      wx.hideLoading();
      this.getWeatherData();
    };
    geocoder(
      lat,
      lon,
      (res) => {
        wx.hideLoading();
        let result = (res.data || {}).result;
        // console.log(result);
        if (res.statusCode === 200 && result && result.address) {
          let {
            address,
            formatted_addresses,
            address_component
          } = result;
          let {
            province,
            city,
            district: county
          } = address_component;
          if (formatted_addresses && (formatted_addresses.recommend || formatted_addresses.rough)) {
            address = formatted_addresses.recommend || formatted_addresses.rough;
          }
          this.setData({
            province,
            city,
            county,
            address: name || address
          });
          this.getWeatherData();
        } else {
          fail();
        }
      },
      fail
    )
  },

  // 获取天气信息
  getWeatherData(cb) {
    wx.showLoading({
      title: '获取数据中',
      mask: true
    });
    const fail = (e) => {
      wx.hideLoading();
      if (typeof cb === 'function') cb();
      wx.showToast({
        title: '加载失败，请稍后再试',
        icon: 'none',
        duration: 3000
      });
    }
    const {
      lat,
      lon
    } = this.data;
    getWeather(lat, lon)
      .then((data) => {
        // console.log(data);
        let {
          current,
          oneWord
        } = data.result;
        wx.hideLoading();
        if (typeof cb === 'function') cb();
        this.setData({
          current,
          oneWord
        });
      }).catch(fail);
  },

  onLoad() {
    wx.getSystemInfo({
      success: (res) => {
        let width = res.windowWidth;;
        let scale = width / 375;
        // console.log(scale * res.statusBarHeight*2+24);
        this.setData({
          width,
          scale,
          paddingTop: res.statusBarHeight + 12
        })
      }
    });
    this.getLocation();
  },
})