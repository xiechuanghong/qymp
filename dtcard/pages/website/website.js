// pages/website/website.js
const app = getApp()
var WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgArr: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540621781148&di=843bc7e3d9cdd2ce059fb988c753e5da&imgtype=0&src=http%3A%2F%2Fimg1.3lian.com%2F2015%2Fa1%2F141%2Fd%2F243.jpg', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3819545867,2119749480&fm=26&gp=0.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540621869363&di=a4a4bb5d6eb69015bb998ebf41c1d25b&imgtype=0&src=http%3A%2F%2Fpicture.ik123.com%2Fuploads%2Fallimg%2F180711%2F12-1PG1152346.jpg'],
    current: 1,
    websiteData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData)
    this.getWebsiteData()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    app.userLog(1, 63)
    return {
      title: '我的朋友圈',
      desc: '分享页面的内容',
      // path: '/page/user?id=123' // 路径，传递参数到指定页面。
    }
  },

  /**
   * 轮播图滑动事件
   */
  onChangeSwiper: function(e) {
    console.log(e)
    this.setData({
      current: e.detail.current + 1
    })
  },

  /**
   * 获取官网信息
   */
  getWebsiteData() {
    wx.showLoading({
      title: '正在加载中',
    })
    let that = this
    wx.request({
      url: app.globalData.url + 'HomePageModulars/Index',
      method: 'GET',
      data: {
        CardID: app.globalData.CardID,
        UserID: app.globalData.userInfo.UserID
      },
      success(res) {
        if (res.data.State == 'Success') {
          for (var i = 0; i < res.data.Result.length; i++) {
            if (res.data.Result[i].Type == 0) {
              WxParse.wxParse('content', 'html', res.data.Result[i].Content, that)
            }
          }
          that.setData({
            websiteData: res.data.Result
          },() => {
            wx.hideLoading()
          })
        }
      }
    })
  },

  /**
   * 手机呼叫
   */
  onPhoneCall(even) {
    let that = this
    wx.makePhoneCall({
      phoneNumber: even.currentTarget.dataset.phone,
      success(res) {
        if (res.errMsg == 'makePhoneCall:ok') {
          app.userLog(app.globalData.CardID, 80)
        }
      }
    });
  },

  /**
   * 打开地图
   */
  onLocation(e) {
    console.log(e)
    let that = this;
    wx.openLocation({
      latitude: e.currentTarget.dataset.lat,
      longitude: e.currentTarget.dataset.lng,
      name: '财富广场',
      address: e.currentTarget.dataset.name
    })
  },

  /**
   * 复制邮箱
   */
  onContentCopyEmail(event) {
    console.log(event)
    wx.setClipboardData({
      data: event.currentTarget.dataset.copy,
      success(res) {
        if (res.errMsg == 'setClipboardData:ok') {
          app.userLog(app.globalData.CardID, 81)
        }
      }
    });
  },
})