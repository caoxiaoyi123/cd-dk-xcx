// pages/test/test.js
const record=wx.getRecorderManager();
const innerAudioContext =wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
    data: {
        tempFilePath:[],
        isStop:false,
        obj: {
            duration: 600000,//指定录音的时长，单位 ms
            format: 'mp3',//音频格式，有效值 aac/mp3
        },
        str:'',
        num:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that=this;
        record.onStop((res) => {//监听录音停止
            // this.setData({
            //     tempFilePath: res.tempFilePath
            // })
            that.data.tempFilePath.push(res.tempFilePath);
            if(that.data.isStop){
                return false
            }
            //开始录音
            record.start(that.data.obj);
        })

        innerAudioContext.onEnded((res)=>{//监听播放自动停止
            that.data.num++;
            that.autoPlay();            
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

    },

    start: function () {
        //开始录音
        record.start(this.data.obj);
        wx.setKeepScreenOn({//保持屏幕高亮
            keepScreenOn:true
        })
        //错误回调
        record.onError((res) => {
            
        })
    },
    stop: function () {
        this.data.isStop=true;
        record.stop();
    },
    play(){
        let that=this;
        // wx.showToast({
        //     title: that.data.tempFilePath,
        //     icon: 'none',
        //     duration: 1000
        // })
        // let audioContext = wx.createAudioContext('myAudio');
        // audioContext.setSrc(that.data.tempFilePath);
        // audioContext.play();
        // innerAudioContext.autoplay = true;
        innerAudioContext.src = that.data.tempFilePath[0];
        innerAudioContext.play();
        // innerAudioContext.onPlay(() => {
        //     console.log('开始播放')
        // })
        // innerAudioContext.onError((res) => {
        //     console.log(res.errMsg)
        //     console.log(res.errCode)
        // })
    },
    autoPlay(){//上个音频结束后自动播放下个音频
        let that=this;
        let n=that.data.num;
        wx.showToast({
            title:n,
            icon: 'none',
            duration: 1000
        })
        if (n == that.data.tempFilePath.length) {
            that.data.num = 0
            return false
        }
        innerAudioContext.src = that.data.tempFilePath[n];
        innerAudioContext.play();
    }
})