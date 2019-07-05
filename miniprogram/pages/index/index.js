// pages/index/index.js
let appid = getApp().data.appid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    shareData: '',
    img: [
      'http://prefile.biaodaa.com/images/1554187714958_4.png',
      'http://prefile.biaodaa.com/images/1554187714959_10.png',
      'http://prefile.biaodaa.com/images/1554187714961_11.png',
      'http://prefile.biaodaa.com/images/1554187714967_13.png',
      'http://prefile.biaodaa.com/images/1554187714968_14.png',
      'http://prefile.biaodaa.com/images/1554187714963_11.png'
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    if (JSON.stringify(options) == '{}') { //正常方式进入
      this.setData({
        src: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=https%3a%2f%2fpre-imis.biaodaa.com%2findex.html&response_type=code&scope=snsapi_base&state=CD-IMIS#wechat_redirect'
      })
    } else { //录音完进入
      let url = decodeURIComponent(options.uri) + '?type=' + options.type + '&id=' + options.id + '&path=' + options.audioPath
      console.info(url);
      this.setData({
        src: url
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  getParam(url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    if (url != null && url.toString().length > 1) {
      var r = url.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
  },
  msg(e) { //分享时，从网页传来的data
    let num = e.detail.data.length - 1;
    console.log(e);
    this.setData({
      shareData: e.detail.data[num]
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(option) {
    console.log(option)
    let num = Math.round(Math.random() * 6); //随机数组下标
    let imgsrc = this.data.img[num];
    let index = option.webViewUrl.indexOf('?');
    let index2 = option.webViewUrl.indexOf('#');
    let url1 = option.webViewUrl.substring(0, index);
    let url2 = option.webViewUrl.substring(index2, option.webViewUrl.length);
    if (url2.indexOf('groupQrcode') > -1) { //邀请入群
      url2 = url2.replace(/groupQrcode/, 'applyEntry');
      url2 = url2 + '&istrue=1';
    }
    if (url2.indexOf('cardDetail') > -1) { //邀请入群
      url2 = url2 + '&isShare=1';
    }
    let urlEnd = url1 + url2;
    urlEnd = encodeURIComponent(urlEnd);
    let path = '/pages/cardDetail/cardDetail?uri=' + urlEnd;
    let shartData = this.data.shareData;
    let data = {
      title: '定课成就美好人生',
      path: path,
      success(res) {
        console.log(res)
      }
    }
    if (shartData != '') {
      if (url2.indexOf('applyEntry') > -1) { //邀请入群
        data.title = shartData.title;
      } else if (url2.indexOf('cardDetail') > -1) { //打卡详情
        data.title = shartData.title + ',' + shartData.desc;
      }
      data.imageUrl = imgsrc
    }
    return data
  }
})