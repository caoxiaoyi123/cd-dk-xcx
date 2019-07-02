// pages/follow/follow.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isFollow:false,
        imgurl:'',
        name:'',
        num:'',
        applyTxt:'申请入群',
        id:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that=this;
        let id = options.id;
        console.log(options.id)
        // let id ='43bc1b5989ec45b2bdd8f7faf001e35d';
        wx.request({
            url: 'https://imis.biaodaa.com/group/detail/' + id,
            success(res) {
                console.log(res.data.data);
                if (res.data.data.isConcern==0){
                    that.data.isFollow=true;
                }
                that.setData({
                    imgurl: res.data.data.imgUrl,
                    name: res.data.data.groName,
                    num: res.data.data.userCount
                })
            },
            complete() {

            }
        })
    },
    applyGroup(){
        let that=this;
        if (that.data.applyTxt != '申请入群') {
            return false
        }
        wx.request({
            url: 'https://imis.biaodaa.com/group/apply',
            data:{
                groId: that.data.id
            },
            method:'POST',
            success(res) {
                if (res.data.code == 1) {
                    that.data.applyTxt = '已申请';
                    wx.showToast({
                        title: '您的申请已提交，请等待群组审批',
                        icon:'none'
                    })
                } else if (res.data.code == 403) {
                    that.data.applyTxt = '已申请';
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                } else {
                    that.data.applyTxt = '已入群';
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            },
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

    }
})