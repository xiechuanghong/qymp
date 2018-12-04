// pages/shop/shop.js
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
    isInputShow: true,
    currentTab: 0, //预设当前项的值
    productsList: [],
    isPeriod: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init()
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
      },
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
    console.log('用户下拉')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('到底部了')
    if (HasNextPage) {
      console.log('没有更多数据了')
      return
    }
    this.getProductsList(this.data.kindid, ++PageNumber)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 滚动切换标签样式
   */
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
  },

  /**
   * 滑动改变页面
   */
  durationChange(e) {
    this.setData({
      currentTab: e.detail.current
    })
  },

  /**
   * 跳转到商品详情页
   */
  goodsDetail(e) {
    wx.navigateTo({
      url: '/pages/shopDetail/shopDetail?ProductID=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 点击搜索事件
   */
  choice() {
    wx.navigateTo({
      url: '/pages/shop/search/search',
    })
    // wx.setNavigationBarTitle({
    //   title: '搜索名片'
    // })
    // this.setData({
    //   isInputShow: false,
    // })
  },



  /**
   * 滚动事件
   */
  onPageScroll: function(e) {
    if (this.data.isInputShow) {
      let query = wx.createSelectorQuery();
      let that = this;
      query.select('.top-logo').boundingClientRect(function(rect) {
        // console.log(rect)
        if (e.scrollTop >= rect.height) {
          that.setData({
            fixednav: true
          })
        } else {
          that.setData({
            fixednav: false
          })
        }
      }).exec();
    }
  },

  /**
   * 获取企业信息
   */
  getEnterpriseInfo() {
    let that = this
    wx.request({
      url: app.globalData.url + 'Products/GetEnterpriseInfo',
      method: 'get',
      data: {
        EnterpriseID: 17
      },
      success(res) {
        if (res.statusCode == 200) {
          that.setData({
            enterpriseInfo: res.data.Result[0]
          })
        }
      }
    })
  },

  /**
   * 获取商品列表
   */
  getProductsList(kindID, page) {
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
        KindID: kindID || '',
        PageSize: 10,
        page: page || 1
      },
      success(res) {
        if (res.statusCode == 200) {
          let productsList = that.data.productsList
          productsList.push(...res.data.Result.Data)
          that.setData({
            productsList: productsList,
            isPeriod: res.data.Result.Page.HasNextPage
          })
          if (!res.data.Result.Page.HasNextPage) {
            HasNextPage = true
          }
          PageNumber = res.data.Result.Page.PageNumber
          wx.hideLoading()
        }
      }
    })
  },

  /**
   * 获取商品分类
   */
  getProductKindsList() {
    let that = this
    wx.request({
      url: app.globalData.url + 'Products/GetProductKindsList',
      method: 'get',
      data: {
        EnterpriseID: 17
      },
      success(res) {
        if (res.data.State == 'Success') {
          that.setData({
            productKindsList: res.data.Result
          })
        }
      }
    })
  },

  /**
   * 点击标题切换当前页时改变样式
   */
  swichNav: function(e) {
    HasNextPage = false
    if (this.data.currentTaB == e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current,
        kindid: e.target.dataset.id,
        productsList: []
      })
      this.getProductsList(e.target.dataset.id)
    }
  },

  /**
   * 初始化
   */
  init() {
    this.getEnterpriseInfo()
    this.getProductsList()
    this.getProductKindsList()
  }
})