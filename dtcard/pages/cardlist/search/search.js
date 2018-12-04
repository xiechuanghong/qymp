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
    isPeriod: true,
    searchData:{
      Page:{},
      Data:[]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    PageNumber = 1
    console.log(PageNumber)
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
    // if (!this.data.isPeriod) {
    //   console.log('没有更多数据了~~')
    //   return
    // }
    console.log('到底部了')
    if (!this.data.searchData.Page.HasNextPage) {
      return
    }
    this.getTest(this.data.val, ++PageNumber)
    // this.getProductsList(this.data.val, ++PageNumber)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 开始搜索
   */
  search(e, page) {
    let searchData = this.data.searchData
    searchData.Page = {}
    searchData.Data = []
    if (e.detail.value == '') {
      // this.setData({
      //   no: true,
      //   data: searchData
      // })
      return
    }
    this.setData({
      val: e.detail.value,
      resultArr: [],
      searchData: searchData
    })
    // this.getTest(e.detail.value,PageNumber)
    this.getProductsList(e.detail.value, PageNumber)
  },

  /**
   * 获取商品列表
   */
  getProductsList(val, page) {
    let that = this
    let searchData = this.data.searchData
    wx.request({
      url: app.globalData.url + 'Card/Index',
      method: 'get',
      data: {
        EnterpriseID: 17,
        Filter: val,
        page: page || 1,
        PageSize: 10
      },
      success(res) {
        if (res.data.State == 'Success') {
          searchData.Data.push(...res.data.Result.Data)
          searchData.Page = res.data.Result.Page
          that.setData({
            searchData: searchData
          })
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

  /**
   * 测试
  */
  getTest(val, page) {
    let that = this
    let searchData = this.data.searchData
    wx.request({
      url: app.globalData.url + 'Card/TestIndex',
      method: 'get',
      data: {
        EnterpriseID: 17,
        Filter: val,
        page: page || 1,
        PageSize: 10
      },
      success(res) {
        if (res.data.State == 'Success') {
          searchData.Data.push(...res.data.Result.Data)
          searchData.Page = res.data.Result.Page
          that.setData({
            searchData: searchData
          })
        }
      }
    })
  },

  /**
   * 搜索成功跳转
   */
  card_detail(e) {
    app.globalData.CardID = e.currentTarget.dataset.id
    wx.reLaunch({
      url: '/pages/carddetail/carddetail?CardID=' + e.currentTarget.dataset.id,
    })
  },
})