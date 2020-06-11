const app = getApp();
const globalData = app.globalData;

Page({
  data: {
    avatarUrl: globalData.avatarUrl,
    nickname: globalData.nickname,
    auth: -1,
    daysStyle: [],
    todayEmotion: '',
    activeEmotion: 'serene',
    emtions: ['serene', 'hehe', 'ecstatic', 'sad', 'terrified'],
    colors: {
      serene: '#64d9fe',
      hehe: '#d3fc1e',
      ecstatic: '#f7dc0e',
      sad: '#ec238a',
      terrified: '#ee1aea'
    }
  },
  setCalendarColor(year, month) {
    year = year || new Date().getFullYear();
    month = month || new Date().getMonth + 1;
  },
  goBack() {
    wx.navigateBack();
  },
})