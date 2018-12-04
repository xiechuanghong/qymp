//app.js
App({
  onLaunch: function(options) {
    console.log('onLaunch')
    let that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res);
    //     wx.request({
    //       url: that.globalData.url + 'Account/LoginByWeiXin',
    //       data: {
    //         code: res.code,
    //         Type: 1
    //       },
    //       method: 'post',
    //       success(res) {
    //         if (res.data.State == 'Success') {
    //           console.log(res)
    //           let data = res.data.Result
    //           if (data.User) {
    //             that.globalData.isGetUserInfo = false
    //           }
    //           that.globalData.openId = data.OpenID
    //           that.globalData.unionId = data.UnionID
    //           that.globalData.userInfo = data.User
    //           console.log(that.globalData)
    //         }
    //       }
    //     })
    //   }
    // })
    
  },

  // 注册用户
  register(NickName, HeadImgUrl, UnionID, IsSubscribe) {
    wx.request({
      url: this.globalData.url + 'Account/RegisterByWeiXin',
      method: 'post',
      data: {
        NickName: NickName,
        HeadImgUrl: HeadImgUrl,
        UnionID: UnionID,
        IsSubscribe: IsSubscribe || false
      },
      success(res) {
        console.log('注册成功')
      }
    })
  },

  // 记录添加
  userLog(id, logType) {
    wx.request({
      url: this.globalData.url + 'UserLog/Create',
      method: 'post',
      data: {
        UserID: this.globalData.userInfo.UserID,
        RelationID: id,
        Type: logType
      },
      success(res) {
        console.log(res)
      }
    })
  },
  globalData: {
    userInfo: null,
    url: 'https://www.dtoao.com/',
    isGetUserInfo: true,
  }
})