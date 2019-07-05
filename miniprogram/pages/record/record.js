// pages/record/record.js
const record = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
const pages = getCurrentPages();
let prevPage = pages[pages.length - 1];
const url = getApp().data.url;
if (wx.setInnerAudioOption) {
  wx.setInnerAudioOption({
    obeyMuteSwitch: false,
  })
} else {
  innerAudioContext.obeyMuteSwitch = false;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: true, //负责页面切换
    recordTipTxt: '  ',
    recordObj: { //音频api参数
      duration: 600000, //指定录音的时长，单位 ms
      format: 'mp3', //音频格式，有效值 aac/mp3
    },
    recordIsStop: false, //是否手动停止
    hearNowTime: { //当前播放时间
      minute: '0' + 0,
      second: '0' + 0
    },
    hearSlierWidth: 0, //进度条百分比
    hearTxt: '播放',
    hearIsPlay: false,
    num: 0, //第几段音频
    interval: '', //记录定时器id
    isClick: true,
    imgsrc: '/image/ks.png',
    tempFilePath: [], //音频链接组 本地
    ngPath: [], //服务器上链接
    ngPathLength: 0,
    date: { //秒表显示值or总时长
      minute: '0' + 0,
      second: '0' + 0
    },
    formData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().setWatcher(this);
    this.setData({ //刚进来拿网页传过来的参
      formData: options,
    })
    let that = this;
    record.onStop((res) => { //监听录音停止
    console.info(res)
      that.data.tempFilePath.push(res.tempFilePath);
      if (that.data.recordIsStop) {
        return false;
      }
      //开始录音
      record.start(that.data.recordObj);
    })
    //微信语音来电情况
    record.onInterruptionBegin((res) => { //监听录音中断
      this.data.recordIsStop = true;
      record.stop();
      clearInterval(this.data.interval);
      this.setData({
        isClick: true,
        recordTipTxt: '录音已暂停',
        imgsrc: '/image/ks.png',
      })
    })
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
    this.data.recordIsStop = true;
    record.stop();
    this.pause();
    this.setData({
      isClick: true,
      recordTipTxt: '录音已暂停',
      imgsrc: '/image/ks.png',
      hearTxt: '播放'
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.data.recordIsStop = true;
    record.stop();
    this.pause();
    this.setData({
      isClick: true,
      recordTipTxt: '录音已暂停',
      imgsrc: '/image/ks.png',
      hearTxt: '播放'
    })
  },
  watch: {
    ngPathLength(newValue) {
      let that = this;
      let pathL = this.data.tempFilePath.length;
      if (pathL == newValue) {
        let arr = this.data.ngPath;
        if (JSON.stringify(arr).indexOf('null') == -1) {
          that.joinRecord()
        }
      }
    },
  },
  /**
   * 开始录音
   */
  start: function() { //点击开始
    let that = this;
    //开始计数,记录进度
    let interval;
    record.onStart(() => {
      interval = setInterval(that.recordTimer, 1000);
      that.setData({
        interval: interval
      })
    })
    wx.setKeepScreenOn({ //保持屏幕高亮
      keepScreenOn: true,
    });
    //错误回调
    record.onError((res) => {});
    //开始录音
    record.start(that.data.recordObj);
  },
  /**
   * 录音秒表
   */
  recordTimer() {
    const that = this
    let second = that.data.date.second
    let minute = that.data.date.minute
    second++
    if (second >= 60) {
      second = 0 //  大于等于60秒归零
      minute++
      if (minute < 10) {
        // 少于10补零
        minute = '0' + minute;
      }
    }
    if (second < 10) {
      // 少于10补零
      second = '0' + second;
    }
    that.setData({
      date: {
        minute: minute,
        second: second
      },
    })
  },
  /**
   * 播放秒表
   */
  hearTimer() {
    const that = this;
    let second = that.data.hearNowTime.second;
    let minute = that.data.hearNowTime.minute;
    let s = that.data.date.second,
      m = that.data.date.minute;
    if (second === s && minute === m) {
      that.setData({
        hearIsPlay: true
      })
      innerAudioContext.stop();
      return false
    }
    second++;
    let slier = (minute * 60 + second) / (m * 60 + s);
    if (second >= 60) {
      second = 0 //  大于等于60秒归零
      minute++;
      if (minute < 10) {
        // 少于10补零
        minute = '0' + minute;
      }
    }
    if (second < 10) {
      // 少于10补零
      second = '0' + second;
    }
    slier = (slier * 100) + '%';
    that.setData({
      hearSlierWidth: slier,
      hearNowTime: {
        minute: minute,
        second: second
      },
    })
  },
  /**
   * 点击事件
   */
  clickTap() {
    //调取小程序新版授权页面
    const that = this
    wx.authorize({
      scope: 'scope.record',
      success() {
        // //第一次成功授权后 状态切换为2
        if (!that.data.isClick) {
          //暂停
          that.data.recordIsStop = true;
          record.stop();
          clearInterval(that.data.interval);
          that.setData({
            isClick: true,
            recordTipTxt: '录音已暂停',
            imgsrc: '/image/ks.png',
          })
        } else {
          //开始继续
          that.start();
          that.setData({
            isClick: false,
            recordTipTxt: '正在录音',
            imgsrc: '/image/zt.png',
          })
        }
      },
      fail() {
        console.log("第一次录音授权失败");
        wx.showModal({
          title: '提示',
          content: '您未授权录音，功能将无法使用',
          showCancel: true,
          confirmText: "授权",
          confirmColor: "#52a2d8",
          success: function(res) {
            if (res.confirm) {
              //确认则打开设置页面（重点）
              wx.openSetting({
                success: (res) => {
                  console.log(res.authSetting);
                  if (!res.authSetting['scope.record']) {
                    //未设置录音授权
                    console.log("未设置录音授权");
                    wx.showModal({
                      title: '提示',
                      content: '您未授权录音，功能将无法使用',
                      showCancel: false,
                      success: function(res) {

                      },
                    })
                  } else {
                    //第二次才成功授权
                    console.log("设置录音授权成功");
                    record.start();
                  }
                },
                fail: function() {
                  console.log("授权设置录音失败");
                }
              })
            } else if (res.cancel) {
              console.log("cancel");
            }
          },
          fail: function() {
            console.log("openfail");
          }
        })
      }
    })
  },
  /**
   * 自动播放
   */
  autoPlay() { //上个音频结束后自动播放下个音频
    let that = this;
    let n = that.data.num;
    if (n == that.data.tempFilePath.length) {
      that.data.num = 0
      clearInterval(that.data.interval);
      that.setData({
        imgsrc: '/image/ks.png',
        hearTxt: '播放',
        hearNowTime: { //当前播放时间
          minute: '0' + 0,
          second: '0' + 0
        },
        hearSlierWidth: 0, //进度条百分比
        num: 0
      })
      return false
    }
    innerAudioContext.src = that.data.tempFilePath[n];
    innerAudioContext.play();
  },
  /**
   * 播放首个音频
   */
  play() {
    let that = this;
    let interval;
    interval = setInterval(that.hearTimer, 1000);
    that.setData({
      interval: interval
    })
    innerAudioContext.src = that.data.tempFilePath[0];
    innerAudioContext.play();
    innerAudioContext.onEnded((res) => { //监听播放停止
      if (that.data.hearIsPlay) {
        clearInterval(that.data.interval);
        that.setData({
          imgsrc: '/image/ks.png',
          hearTxt: '播放',
          hearIsPlay: false,
          hearNowTime: { //当前播放时间
            minute: '0' + 0,
            second: '0' + 0
          },
          hearSlierWidth: 0, //进度条百分比
          num: 0,
        })
        return false;
      }
      that.data.num++;
      that.autoPlay();
    })
  },
  pause() {
    clearInterval(this.data.interval);
    innerAudioContext.pause();
  },
  /**
   * 播放/暂停
   */
  playTap() {
    let that = this;
    let {
      minute,
      second
    } = this.data.hearNowTime;
    if (this.data.hearTxt == '播放') {
      that.play();
      that.setData({
        imgsrc: '/image/zt.png',
        hearTxt: '暂停'
      });
    } else {
      that.pause();
      that.setData({
        imgsrc: '/image/ks.png',
        hearTxt: '播放'
      })
    }
  },
  /**
   * 重录
   */
  remake() {
    let pathL = this.data.tempFilePath.length;
    if (pathL == 0) {
      if (this.data.recordTipTxt == '  ') {
        wx.showToast({
          title: '请先开始录音',
          icon: 'none'
        })
        return false
      }
    }
    let that = this;
    this.data.recordIsStop = true;
    record.stop();
    that.pause();
    this.setData({
      isClick: true,
      recordTipTxt: '录音已暂停',
      imgsrc: '/image/ks.png',
      hearTxt: '播放'
    })

    wx.showModal({
      title: '确认重新录制吗?',
      content: '对录制的声音不满意,\r\n不要灰心，点击重新录制吧',
      confirmText: '重新录制',
      confirmColor: '#EA2923',
      success(res) {
        if (res.confirm) {
          //确定
          that.setData({
            page: true, //负责页面切换
            recordTipTxt: '  ',
            recordIsStop: false, //是否手动停止
            hearNowTime: { //当前播放时间
              minute: '0' + 0,
              second: '0' + 0
            },
            hearSlierWidth: 0, //进度条百分比
            hearTxt: '播放',
            hearIsPlay: false,
            num: 0, //第几段音频
            interval: '', //记录定时器id
            isClick: true,
            imgsrc: '/image/ks.png',
            tempFilePath: [], //音频链接组 本地
            ngPath: [], //服务器上链接
            date: { //秒表显示值or总时长
              minute: '0' + 0,
              second: '0' + 0
            },
          })
        } else {

        }
      }
    })
  },
  /**
   * 拼接录音
   * */
  joinRecord() {
    let that = this;
    let data = that.data.formData;
    let pathArr = that.data.ngPath;
    wx.request({
      url: `${url}/upload/merge`,
      header: {
        'X-TOKEN': data.token
      },
      data: {
        files: pathArr
      },
      method: 'POST',
      success(res) {
        wx.hideLoading();
        let path = encodeURIComponent(res.data.data);
        that.setData({
          page: true, //负责页面切换
          recordTipTxt: '  ',
          recordObj: { //音频api参数
            duration: 600000, //指定录音的时长，单位 ms
            format: 'mp3', //音频格式，有效值 aac/mp3
          },
          recordIsStop: false, //是否手动停止
          hearNowTime: { //当前播放时间
            minute: '0' + 0,
            second: '0' + 0
          },
          hearSlierWidth: 0, //进度条百分比
          hearTxt: '播放',
          num: 0, //第几段音频
          interval: '', //记录定时器id
          isClick: true,
          imgsrc: '/image/ks.png',
          tempFilePath: [], //音频链接组 本地
          ngPath: [], //服务器上链接
          date: { //秒表显示值or总时长
            minute: '0' + 0,
            second: '0' + 0
          },
        })
        wx.reLaunch({
          url: '/pages/index/index?type=' + data.type + '&id=' + data.id + '&uri=' + data.uri + '&audioPath=' + path
        })
      },
    })
  },
  /**
   *点击上传按钮
   * */
  upload() {
    let that = this;
    let pathL = that.data.tempFilePath.length;
    let n = that.data.ngPath.length;
    if (!this.data.isClick) {
      wx.showToast({
        title: '请先停止录音',
        icon: 'none'
      })
      return false
    }
    if (pathL == 0) {
      wx.showToast({
        title: '请先开始录音',
        icon: 'none'
      })
      return false
    }
    this.data.recordIsStop = true;
    record.stop(); //录音停止
    innerAudioContext.stop(); //播放停止
    //loading
    wx.showLoading({
      title: '正在上传',
      mask: true
    })
    // if (n != pathL) {//如果未上传过，则先上传再拼接
    for (var x = 0; x < pathL; x++) {
      wx.uploadFile({ //停止则上传
        url: `${url}/upload/voice`,
        name: 'file',
        filePath: that.data.tempFilePath[x],
        header: {
          'X-TOKEN': that.data.formData.token
        },
        formData: {
          index: x
        },
        success(resd) {
          let obj = resd.data;
          console.log(resd);
          obj = JSON.parse(obj);
          that.data.ngPath[obj.data.index] = obj.data.audioPath; //防止上传顺序错乱
          let ngl = that.data.ngPath.length;
          that.setData({
            ngPathLength: ngl
          })
        }
      })
    }
  },
  /**
   * 跳转至试听页
   * */
  jumpHear() {
    if (this.data.date.minute == '00' && this.data.date.second == '00') {
      wx.showToast({
        title: '请先开始录音',
        icon: 'none'
      })
      return false
    }
    record.stop();
    clearInterval(this.data.interval);
    this.data.recordIsStop = true;
    // record.pause();
    this.setData({
      isClick: true,
      tipTxt: '录音已暂停',
      imgsrc: '/image/ks.png',
      page: false,
      interval: '', //记录定时器id
      num: 0,
    })

    // let path=this.data.tempFilePath,
    // date=this.data.date;
    // path=JSON.stringify(path);
    // date=JSON.stringify(date);
    // wx.navigateTo({
    //   url: '/pages/hear/hear?path=' + path + '&date=' + date
    // })
  }
})