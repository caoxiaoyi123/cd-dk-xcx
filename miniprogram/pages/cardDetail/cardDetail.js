// pages/cardDetail/cardDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src:'' 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    
    onLoad: function (options) {
      let appid = 'wx26999a53385489f9'
        this.setData({
            src: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri='+options.uri+'&response_type=code&scope=snsapi_base&state=CD-IMIS#wechat_redirect'
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let state = this.getParam(option.webViewUrl.split('#')[0], 'state');
        let index = option.webViewUrl.indexOf('?');
        let urlEnd = option.webViewUrl.substr(index, option.webViewUrl.length);
        urlEnd = encodeURIComponent(urlEnd);
        console.log(urlEnd)
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
            data.title = shartData.title + ',' + shartData.desc;
            data.imageUrl = shartData.imgUrl
        }
        return data
    }
})