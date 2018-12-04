// pages/dynamic/detail/detail.js
const app = getApp()
var WxParse = require('../../../utils/wxParse/wxParse.js');
let ArticleID = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: false,
    dynamicDetail: {},
    currentTab: 0,
    likeData: {
      Page: {},
      Data: []
    },
    commentData: {
      Page: {},
      Data: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    console.log(options)
    ArticleID = options.ArticleID
    if (options.share) {
      that.getCardDetail(options.CardID).then(function() {
        that.setData({
          share: options.share || false
        })
      })
    }
    
    this.init()
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
    // this.getDynamicDetail()
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
    if (this.data.currentTab == '0') {

    } else if (this.data.currentTab == '1') {
      if (!this.data.commentData.Page.HasNextPage) {
        return
      }
      this.getCommentList(++this.data.commentData.Page.PageNumber)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 预览图片
   */
  previewImage(e) {
    var current = e.target.dataset.src
    // console.log(this.data.neswData[e.target.dataset.index])
    var urls = this.data.dynamicDetail.Images
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: urls, // 需要预览的图片http链接列表  
      success(res) {
        console.log(res)
      }
    })
  },

  /**
   * 点赞
   */
  onCollection(e) {
    let obj = {
      Avatar: app.globalData.userInfo.Avatar,
      UserName: app.globalData.userInfo.NickName
    }
    let dynamicDetail = this.data.dynamicDetail
    let likeData = this.data.likeData
    if (dynamicDetail.ArticleID == e.currentTarget.dataset.id) {
      dynamicDetail.HadLike = !dynamicDetail.HadLike
      if (dynamicDetail.HadLike) {
        likeData.Data.unshift(obj)
        console.log(obj, likeData.Data)
          ++likeData.Page.TotalItemCount
        dynamicDetail.LikeCount = dynamicDetail.LikeCount == '点赞' ? 1 : ++dynamicDetail.LikeCount
        console.log('开', dynamicDetail.LikeCount == '点赞', dynamicDetail.LikeCont)
      } else {
        likeData.Data.splice(likeData.Data.findIndex(item => item.Avatar == obj.Avatar), 1)
          --likeData.Page.TotalItemCount
        dynamicDetail.LikeCount = dynamicDetail.LikeCount == '点赞' ? 1 : --dynamicDetail.LikeCount
        if (dynamicDetail.LikeCount == 0) {
          dynamicDetail.LikeCount = '点赞'
        }
      }
    }

    this.setData({
      dynamicDetail,
      likeData
    })
    app.userLog(e.currentTarget.dataset.id, 10)
  },

  /**
   * 动态详情tab切换
   */
  onTabNav(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },

  /**
   * 获取动态详情
   */
  getDynamicDetail() {
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'Article/Detail',
        method: 'get',
        data: {
          ArticleID,
          UserID: app.globalData.userInfo.UserID
        },
        success(res) {
          if (res.data.State == 'Success') {
            that.setData({
              dynamicDetail: res.data.Result
            })
            if (res.data.Result.Type == 1) {
              WxParse.wxParse('content', 'html', res.data.Result.Content, that)
            }
            resolve(res.data.Result)
          }
        }
      })
    })
  },

  /**
   * 获取点赞列表
   */
  getLikeList(page) {
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'Article/LikeList',
        method: 'get',
        data: {
          ArticleID,
          Page: page || 1,
          PageSize: 10
        },
        success(res) {
          if (res.data.State == 'Success') {
            let likeData = that.data.likeData
            likeData.Page = res.data.Result.Page
            likeData.Data.push(...res.data.Result.Data)
            that.setData({
              likeData: likeData
            })
            resolve(res.data.Result)
          }
        }
      })
    })
  },

  /**
   * 获取评论列表
   */
  getCommentList(page) {
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + 'ArticleComment/Index',
        method: 'get',
        data: {
          ArticleID,
          UserID: app.globalData.userInfo.UserID,
          Page: page || 1,
          PageSize: 10
        },
        success(res) {
          if (res.data.State == 'Success') {
            let commentData = that.data.commentData
            commentData.Page = res.data.Result.Page
            commentData.Data.push(...res.data.Result.Data)
            that.setData({
              commentData: commentData
            })
            resolve(res.data.Result)
          }
        }
      })
    })
  },

  /**
   * 初始化
   */
  init() {
    let that = this
    wx.showLoading({
      title: '正在加载中',
      mask: true
    })
    that.getDynamicDetail().then(function(data) {
        return that.getLikeList()
      })
      .then(function(data) {
        return that.getCommentList()
      })
      .then(function(data) {
        console.log(data)
        wx.hideLoading()
      })
  },

  /**
   * 删除
   */
  isShowDel(e) {
    console.log(e)
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
    let that = this
    wx.request({
      url: app.globalData.url + 'ArticleComment/Create',
      method: 'post',
      data: {
        ArticleID,
        UserID: app.globalData.userInfo.UserID,
        Content: that.data.value
      },
      success(res) {
        if (res.data.State == 'Success') {
          that.data.commentData.Data.unshift({
            CommentID: res.data.Result.CommentID,
            CanDelete: true,
            UserName: app.globalData.userInfo.NickName,
            Avatar: app.globalData.userInfo.Avatar,
            Content: that.data.value,
            DateTime: '刚刚'
          })
          that.data.dynamicDetail.CommentCount = res.data.Result.Count
          that.data.commentData.Page.TotalItemCount = res.data.Result.Count
          that.setData({
            commentData: that.data.commentData,
            dynamicDetail: that.data.dynamicDetail,
            value: '',
            Count: res.data.Result.Count
          },()=>{
            wx.showToast({
              title: '评论成功',
            })
          })

          // wx.createSelectorQuery().select('.tab-h').boundingClientRect(function (rect) {
          //   console.log(rect)
          //   wx.pageScrollTo({
          //     scrollTop: rect.top,
          //     duration: 1500
          //   })
          // }).exec()

          // wx.pageScrollTo({
          //   scrollTop: 0,
          //   duration: 0
          // })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.Message,
          })
          return
        }
      }
    })

  },

  /**
   * 删除元素
   */
  delElement(e) {
    let commentData = this.data.commentData
    let dynamicDetail = this.data.dynamicDetail
    let that = this
    commentData.Data.splice(commentData.Data.findIndex((item, index) => {
      return item.CommentID == e.target.dataset.id
    }), 1)
    this.setData({
      commentData
    }, () => {
      wx.request({
        url: app.globalData.url + 'ArticleComment/Delete',
        method: 'POST',
        data: {
          CommentID: e.target.dataset.id,
          UserID: app.globalData.userInfo.UserID
        },
        success(res) {
          console.log(res, dynamicDetail, commentData)
          if (res.data.State == "Success") {
            console.log('删除成功')
            let Count = --that.data.Count
            dynamicDetail.CommentCount = Count
            commentData.Page.TotalItemCount = Count
            that.setData({
              dynamicDetail,
              commentData
            })
          }
        }
      })
    })
  },

  /**
   * 获取名片详情
   */
  getCardDetail(CardID) {
    let that = this
    return new Promise((resolve) => {
      wx.request({
        url: app.globalData.url + 'Card/Detail',
        method: 'get',
        data: {
          CardID: CardID,
          UserID: app.globalData.userInfo.UserID
        },
        success(res) {
          if (res.data.State == 'Success') {
            console.log(res)
            that.setData({
              cardDetail: res.data.Result
            })
            resolve()
          }
        }
      })
    })
  },

  /**
   * 跳转到名片详情页
  */
  onNavigateTo(e) {
    console.log(e)
    wx.reLaunch({
      url: '/pages/carddetail/carddetail?CardID=' + e.currentTarget.dataset.id,
    })
  }
})