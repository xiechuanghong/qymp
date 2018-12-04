// pages/shop/search/search.js
const app = getApp()
let pageCount = 1;
let PageNumber = 1;
let HasNextPage = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultArr: [],
    no: false,
    isPeriod: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    PageNumber = 1
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
    if (!this.data.isPeriod) {
      console.log('没有更多数据了~~')
      return
    }
    this.getProductsList(this.data.val, ++PageNumber)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 开始搜索
   */
  search(e, page) {
    if (e.detail.value == '') {
      this.setData({
        no: true,
        resultArr: []
      })
      return
    }
    this.setData({
      val: e.detail.value,
      resultArr: []
    })
    this.getProductsList(e.detail.value, PageNumber)
  },

  /**
   * 获取商品列表
   */
  getProductsList(val, page) {
    wx.showLoading({
      title: '正在加载中',
      mask: true
    })
    let that = this
    wx.request({
      url: app.globalData.url + 'Products/GetProductsList',
      method: 'get',
      data: {
        EnterpriseID: 17,
        Filter: val,
        page: page || 1,
        PageSize: 10
      },
      success(res) {
        console.log(res)
        let no = that.data.no
        let resultArr = that.data.resultArr
        let isPeriod = that.data.isPeriod
        if (res.data.State == 'Success') {
          if (res.data.Result.Page.PageCount == 0) {
            no = true
            resultArr = []
            isPeriod = true
          } else if (res.data.Result.Page.PageCount == res.data.Result.Page.PageNumber) {
            isPeriod = false
          } else {
            no = false
            resultArr.push(...res.data.Result.Data)
            // resultArr = res.data.Result.Data
          }
          that.setData({
            no: no,
            isPeriod: isPeriod,
            resultArr: resultArr
          })
          wx.hideLoading()
        }
      }
    })
  },

  /**
   * 搜索取消
   */
  cancel() {
    wx.setNavigationBarTitle({
      title: '名片列表'
    })
    wx.navigateBack({
      delta: 1
    })
  },
})