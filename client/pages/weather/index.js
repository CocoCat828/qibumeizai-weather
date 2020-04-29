import {
  geocoder
} from "../../libs/api";

Page({
  data: {
    backgroundImage: '../../images/cloud.jpg',
    backgroundColor: '#62aadc',
    address: '定位中'
  },
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
  // 处理逆地址
  getAddress(lat, lon, name) {
    wx.showLoading({
      title: '定位中',
      mask: true
    });
    let fail = (e) => {
      this.setData({
        address: name || '北京市海淀区西二旗北路'
      });
      wx.hideLoading();
      this.getWeetherData();
    };
    geocoder(
      lat,
      lon,
      (res) => {
        wx.hideLoading();
        let result = (res.data || {}).result;
        // console.log(1, res, result);

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
          this.getWeetherData();
        } else {
          fail();
        }
      },
      fail
    )
  },
  updateLocation(res) {
    let {
      latitude: lat,
      longitude: lon,
      name
    } = res;
    let data = {
      let,
      lon
    }
    if (name) data.address = name;
    this.setData(data);
    this.getAddress(lat, lon, name);
  },
  getLocation() {
    // 获取经纬度
    wx.getLocation({
      type: 'gcj02',
      success: this.updateLocation,
      fail: (e) => {
        // console.log(e)
        this.openLocation()
      }
    })
  },
  openLocation() {
    wx.showToast({
      title: '检测到您未授权使用位置权限，请先开启哦',
      icon: 'none',
      duration: 3000
    });
  },
  chosseLocation() {
    wx.chosseLocation({
      success: (res) => {
        let {latitude, longitude} = res;
        let {lat, lon} = this.data;
        if (latitude == lat && longitude == lon) {
          this.getWeetherData();
        } else {
          this.updateLocation(res);
        }
      }
    })
  },
  onLoad() {
    wx.getSystemInfo({
      success: function (res) {
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