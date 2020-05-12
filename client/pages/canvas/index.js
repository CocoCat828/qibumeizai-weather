Page({
  data: {

  },
  onLoad: function(options) {
    const query = wx.createSelectorQuery();
    query.select('#firstCanvas')
      .fields({ node: true, size: true })
      .exec(res => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.arc(100, 100, 50, 0, 3 * Math.PI);
        ctx.fill();
      });
  },
  onReady: function() {
    //Do some when page ready.

  },
  onShow: function() {
    //Do some when page show.

  },
  onHide: function() {
    //Do some when page hide.

  },
  onUnload: function() {
    //Do some when page unload.

  },
  onPullDownRefresh: function() {
    //Do some when page pull down.

  }
})