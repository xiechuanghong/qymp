// pages/dynamic/dynamic.js
const app = getApp()
let DateTime = ''
let HasNextPage = false
let PageNumber = 1;
let PageNumber2 = 1;
let PageCount = ''
let PageCount2 = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1, //预设当前项的值
    imgArr: ['/img/img03.png', '/img/img03.png', '/img/img03.png'],
    tw: false,
    wz: false,
    like: '',
    num: '7'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init()
    let query = wx.createSelectorQuery();
    let that = this;
    query.select('.tab-h').boundingClientRect(function(rect) {
      wx.getSystemInfo({
        success: function(res) {
          let height = res.windowHeight - rect.height
          console.log(height)
          that.setData({
            height:height
          })
        },
      })
    }).exec();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(app.globalData)
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
    console.log('到底部了')
  },

  /**
   * 用户点击右上角分享 
   */
  onShareAppMessage: function(e) {
    // console.log(this.data.newsData[this.data.currentTab])
    let newsData = this.data.newsData
    app.userLog(e.target.dataset.id, 13)
    return {
      title: newsData[this.data.currentTab].Data[e.target.dataset.index].UserName + '的动态',
      imageUrl: newsData[this.data.currentTab].Data[e.target.dataset.index].Images[0] || newsData[this.data.currentTab].Data[e.target.dataset.index].Avatar,
      path: '/pages/test1/test1?Type=2&ArticleID=' + e.target.dataset.id + '&CardID=' + app.globalData.CardID // 路径，传递参数到指定页面。
    }
  },

  /**
   * 点击标题切换当前页时改变样式
   */
  swichNav: function(e) {
    if (this.data.currentTaB == e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
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
   * 预览图片
   */
  previewImage(e) {
    var current = e.target.dataset.src 
    console.log(current)
    // console.log(this.data.neswData[e.target.dataset.index])
    var urls = this.data.newsData[e.target.dataset.index].Data[e.target.dataset.id].Images
    console.log(urls)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: urls, // 需要预览的图片http链接列表  
      success(res) {
        console.log(res)
      }
    })
  },

  /**
   * 展示全文
   * @param tw 图文类型
   * @param wz 文字类型
   */
  whole(e) {
    let height,
      that = this,
      tw = this.data.tw,
      wz = this.data.wz
    e.target.dataset.type == 1 ? tw = !this.data.tw : wz = !this.data.wz
    this.setData({
      tw: tw,
      wz: wz
    })
    let query = wx.createSelectorQuery();
    query.select('.item-box').boundingClientRect(function(rect) {
      console.log(rect.height)
      that.setData({
        height: rect.height + 'px',
      })
    }).exec();
  },

  /**
   * 点赞
   */
  onCollection(e) {
    let avatar = app.globalData.userInfo.Avatar
    let newsData = this.data.newsData
    newsData.forEach(item => item.Data.find(item => {
      if (item.ArticleID == e.currentTarget.dataset.id) {
        item.HadLike = !item.HadLike
        if (item.HadLike) {
          item.LikeUser.unshift(avatar)
          item.LikeCount = item.LikeCount == '点赞' ? 1 : ++item.LikeCount
          console.log('开', item.LikeCount == '点赞', item.LikeCont)
        } else {
          // item.LikeUser.shift(avatar)
          item.LikeUser.splice(item.LikeUser.findIndex(item => item == avatar), 1)
          console.log(item.LikeUser, item.LikeUser.findIndex(item => item == avatar))
          item.LikeCount = item.LikeCount == '点赞' ? 1 : --item.LikeCount
          if (item.LikeCount == 0) {
            item.LikeCount = '点赞'
          }
          // item.LikeCount = item.LikeCount == 0 ? '点赞': --item.LikeCount
          console.log('关')
        }
        // if(item.LikeCount == '点赞') {
        //   item.LikeCount = '1'
        // } else if(item.LikeCount != '点赞') {
        //   ++item.LikeCount
        // }

        // console.log(item.LikeCount)
        // item.LikeCount = (item.LikeCount == '点赞') ? '1' : '点赞'
      }
    }))
    this.setData({
      newsData: newsData
    })
    app.userLog(e.currentTarget.dataset.id, 10)
  },

  /**
   * 获取动态数据
   */
  getArticleData(Type, Time, Page) {
    wx.showLoading({
      title: '正在加载中',
      mask:true
    })
    let that = this
    return new Promise(function(resolve, reject) {
      wx.request({
        url: app.globalData.url + 'Article/Index',
        method: 'get',
        data: {
          CardID: app.globalData.CardID,
          UserID: app.globalData.userInfo.UserID,
          Type: Type || 0,
          PageSize: 10,
          Time: Time || '',
          Page: Page || 1
        },
        success(res) {
          if (res.data.State == 'Success') {
            if (Type == 0) {
              PageNumber = res.data.Result.Page.PageNumber
            } else {
              PageNumber2 = res.data.Result.Page.PageNumber
            }
            console.log(PageNumber, PageNumber2)
            resolve(res.data.Result)
            // wx.hideLoading()
          }
        }
      })
    })
  },

  /**
   * 初始化
   */
  init() {
    let that = this;
    let p = Promise.all([this.getArticleData(0), this.getArticleData(1)]).then(function(val) {
      that.setData({
        newsData: val
      },()=>{
        wx.hideLoading()
      })
    });
  },

  /**
   * scroll底部事件
   */
  onScrolltolower() {
    let that = this
    let currentTab = this.data.currentTab
    if (currentTab == 0 && !this.data.newsData[currentTab].Page.HasNextPage) {
      return
    } else if (currentTab == 1 && !this.data.newsData[currentTab].Page.HasNextPage) {
      return
    }
    let page = currentTab == 0 ? PageNumber : PageNumber2
    this.getArticleData(currentTab, this.data.newsData[currentTab].Data[0].DateTime, ++page).then(function(data) {
      let newsData = that.data.newsData
      newsData[currentTab].Data.push(...data.Data)
      newsData[currentTab].Page = data.Page
      that.setData({
        newsData: newsData
      },()=>{
        wx.hideLoading()
      })
    })
    console.log(currentTab)
    console.log('到底部了')
  },


  /**
   * 动态列表跳转
   */
  detail(e) {
    console.log(12345)
    wx.navigateTo({
      url: '/pages/dynamic/detail/detail?ArticleID=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})