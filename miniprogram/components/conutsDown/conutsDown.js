// components/conuts down.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hours: '0' + 0,   // 时
    minute: '0' + 0,   // 分
    second: '0' + 0    // 秒
  },
  created() {
    this.timer()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    timer: function () {
      const that = this
      var second = that.data.second
      var minute = that.data.minute
      var hours = that.data.hours
      setInterval(function () {  // 设置定时器
        second++
        if (second >= 60) {
          second = 0  //  大于等于60秒归零
          minute++
          if (minute >= 60) {
            minute = 0  //  大于等于60分归零
            hours++
            if (hours < 10) {
              // 少于10补零
              that.setData({
                hours: '0' + hours
              })
            } else {
              that.setData({
                hours: hours
              })
            }
          }
          if (minute < 10) {
            // 少于10补零
            that.setData({
              minute: '0' + minute
            })
          } else {
            that.setData({
              minute: minute
            })
          }
        }
        if (second < 10) {
          // 少于10补零
          that.setData({
            second: '0' + second
          })
        } else {
          that.setData({
            second: second
          })
        }
      }, 1000)
    },
  }
})
