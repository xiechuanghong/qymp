// pages/cardlist/cardlist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isGetUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cardList: {
      Page: {},
      Data: []
    },
    resultArr: [],
    startX: 0, //开始坐标
    startY: 0,
    isInputShow: true,
    flValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    this.getUserInfo()
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
    if (!this.data.cardList.Page.HasNextPage) {
      return
    }
    this.getUserInfo(++this.data.cardList.Page.PageNumber)
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },

  /**
   * 手指触摸动作开始 记录起点X坐标
   */
  touchstart: function(e) {
    console.log(e)
    //开始触摸时 重置所有删除
    this.data.cardList.Data.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cardList: this.data.cardList
    })
  },

  /**
   * 滑动事件处理
   */
  touchmove: function(e) {
    console.log(e)
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.cardList.Data.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      cardList: that.data.cardList
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  /**
   * 置顶
   */
  onSetTop(e) {
    console.log(e.currentTarget.dataset.index)
    let cardList = this.data.cardList
    cardList.Data[e.currentTarget.dataset.index].more = !cardList.Data[e.currentTarget.dataset.index].more
    this.setData({
      cardList
    })
  },

  /**
   * 打开搜索
   */
  onChoice() {
    wx.navigateTo({
      url: '/pages/cardlist/search/search',
    })
  },

  /**
   * 搜索成功跳转
   */
  onCardDetail(e) {
    app.globalData.CardID = e.currentTarget.dataset.id
    wx.reLaunch({
      url: '/pages/carddetail/carddetail?CardID=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 置顶名片
   */
  onFirstCard(e) {
    let that = this
    let cardList = this.data.cardList,
      catData
    // catData = cardList.Data.splice(cardList.Data.indexOf(cardList.Data[e.currentTarget.dataset.index]), 1)
    // console.log(cardList.Data, e.currentTarget.dataset.index, catData)
    // console.log(cardList.Data[e.currentTarget.dataset.index])
    this.reqFirstCard(e.currentTarget.dataset.id).then((res) => {
      cardList.Data[e.currentTarget.dataset.index].IsTop = res.IsTop
      cardList.Data[e.currentTarget.dataset.index].more = false
      if (cardList.Data[e.currentTarget.dataset.index].IsTop) {
        cardList.Data.unshift(...cardList.Data.splice(cardList.Data.indexOf(cardList.Data[e.currentTarget.dataset.index]), 1))
        console.log('置顶', cardList.Data)
      } else {
        cardList.Data.splice(res.TopCount, 0, ...cardList.Data.splice(cardList.Data.indexOf(cardList.Data[e.currentTarget.dataset.index]), 1))
        console.log('取消置顶', cardList.Data)
      }
      that.setData({
        cardList
      })
    })
  },

  /**
   * 置顶名片接口
   */
  reqFirstCard(CardID) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'Card/Top',
        method: 'post',
        data: {
          UserID: app.globalData.userInfo.UserID,
          CardID: CardID
        },
        success(res) {
          console.log(res)
          if (res.data.State == 'Success') {
            resolve(res.data.Result)
          }
        }
      })
    })
  },

  /**
   * 获取名片数据
   */
  getUserInfo(page) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    wx.request({
      url: app.globalData.url + 'Card/Index',
      method: 'get',
      data: {
        UserID: app.globalData.userInfo.UserID,
        EnterpriseID: 17,
        PageSize: 10,
        page: page || 1
      },
      success(res) {
        let cardList = that.data.cardList
        if (res.statusCode == 200) {
          cardList.Page = res.data.Result.Page
          res.data.Result.Data.forEach((item, index) => {
            item.Avatar = item.Avatar + '?imageView2/1/w/200/h/200/q/200'
            item.Logo = item.Logo + '?imageView2/0/w/64/h/64/q/100'
          })
          cardList.Data.push(...res.data.Result.Data)
          that.setData({
            cardList
          }, () => {
            wx.hideLoading()
          })
        }
      }
    })
  },

})