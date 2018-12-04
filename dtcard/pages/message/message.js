// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageArr: [{
        name: '李逍遥',
        messageText: '这里是评论内容限制150字内，1 分钟内最多发两条评论。'
      },
      {
        name: '酒剑仙',
        messageText: '只能自己删除自己的评论。'
      },
      {
        name: '问天',
        messageText: '这里是评论内容限制150字内，1 分钟内最多发两条评论。'
      },
      {
        name: '无道',
        messageText: '只能自己删除自己的评论。'
      },
      {
        name: '风云',
        messageText: '这里是评论内容限制150字内，1分钟内最多发两条评论。'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },

  /**
   * 删除
   */
  isShowDel(e) {
    if (this.data.setTop === e.currentTarget.dataset.index) {
      this.setData({
        setTop: ''
      })
      return
    }
    this.setData({
      setTop: e.currentTarget.dataset.index
    })
  },

  /**
   * 获取Input值
   */
  getInputVal(e) {
    this.setData({
      value: e.detail.value
    })
  },

  /**
   * 发送事件
   */
  send() {
    this.data.messageArr.unshift({
      isDel: true,
      name: '游客',
      img: '/img/20180420095435718.jpg',
      messageText: this.data.value
    })
    this.setData({
      messageArr: this.data.messageArr,
      value: ''
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },

  /**
   * 删除元素
   */
  delElement(e) {
    this.data.messageArr.splice(this.data.messageArr.filter((ite, index) => index == e.target.dataset.id), 1);
    this.setData({
      messageArr: this.data.messageArr
    })
  }
})