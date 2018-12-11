// pages/carddetail/carddetail.js
const app = getApp()
let CardID = '';
let isClick = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openMask: false,
    name: '',
    title: '',
    signature: '',
    phone: '',
    email: '',
    wechat: '',
    landline: '',
    company: '',
    address: '',

    imgUrls: [],
    popularityList: [],
    logo: '/img/logo.png',
    introduction: '个人简介',
    voiceIntroIcon: '/img/img_voice_play_00.png',
    swiperCurrent: 1,
    myImages: [],
    audioSrc: '',
    duration: '--:--',
    currentTime: '00:00',
    reliableStatus: '/img/ic_home_like_nor.png',
    showFloatIntro: true,
    cardDetail: {},
    labels: [{
        label: '获客神器',
        number: 22,
        style: {
          border: '#FFDFD6',
          background: '#FFFAF9',
          text: '#060F38',
        },
      },
      {
        label: '贴心服务',
        number: 1020,
        style: {
          border: '#BEE9D7',
          background: '#F9FFFC',
        },
      },
      {
        label: '拼搏进取',
        number: 1020,
        style: {
          border: '#D6E2FF',
          background: '#F9FFFF',
        },
      },
      {
        label: '拼搏进取',
        number: 102000000,
        style: {
          border: '#D6E2FF',
          background: '#F9FFFF',
        },
      },
      {
        label: '拼搏进取',
        number: 102000000,
        style: {
          border: '#D6E2FF',
          background: '#F9FFFF',
        },
      },
      {
        label: '拼搏进取',
        number: 102000000,
        style: {
          border: '#D6E2FF',
          background: '#F9FFFF',
        },
      },
    ],

    num: 0,
    imageHeight: 622,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, app.globalData)
    CardID = options.CardID || app.globalData.CardID
    app.globalData.CardID = CardID

    this.init()
    let systemInfo = wx.getSystemInfoSync();
    this.setData({
      imageHeight: ((systemInfo.screenWidth - 64) * 2),
      UserID: app.globalData.userInfo.UserID
    })
    this.innerAudioContext = wx.createInnerAudioContext()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log(this.data)
    // this.getPoster()
    // 3 秒后隐藏 float-intro 
    let self = this;
    setTimeout(() => {
      self.setData({
        showFloatIntro: false
      });
    }, 3000);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(CardID)
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this;
    // console.log(!this.innerAudioContext.paused)
    if (!this.innerAudioContext.paused) {
      console.log('页面隐藏了,停止播放')
      console.log(that.audioIconId)
      clearInterval(that.audioTimerId)
      clearInterval(that.audioIconId)
      this.innerAudioContext.pause()
      isClick = true
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this
    console.log('页面卸载了')
    if (!this.innerAudioContext.paused) {
      console.log('停止播放')
      clearInterval(that.audioTimerId)
      clearInterval(that.audioIconId)
      this.innerAudioContext.destroy()
      isClick = true
    }
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
  onShareAppMessage: function(options) {
    let that = this
    return {
      title: this.data.cardDetail.Name + '的企业名片',
      path: '/pages/test1/test1?Type=1&CardID=' + that.data.cardDetail.CardID,
      imageUrl: this.data.cardDetail.Avatar[0],
      // path: '/pages/test1/test1?type=1&CardID=' + that.data.cardDetail.CardID,
      success: (res) => {
        app.userLog(that.data.cardDetail.CardID, 63)
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
    // return {
    //   title: this.data.cardDetail.Name + '的名片',
    //   desc: '分享' + this.data.cardDetail.Name + '的名片',
    //   success() {
    //     console.log('转发成功')
    //   }
    // }
  },

  /**
   * 初始化
   */
  init() {
    let that = this
    this.getCardDetail().then((data) => {
      console.log(data)
      if (data.Voice) {
        that.initProgress()
        that.initVoice()
      }
      wx.hideLoading()
    })
    this.tsImSign()
  },

  /**
   * current 改变时触发的 change 事件
   */
  swiperBindchange: function(params) {
    this.setData({
      swiperCurrent: params.detail.current + 1
    });
  },

  // 初始化进度条
  initProgress() {
    let that = this
    this.canvasProgressbg = wx.createCanvasContext('canvasProgressbg');
    this.canvasProgressPoint = wx.createCanvasContext('canvasProgressPoint')
    this.canvasProgress = wx.createCanvasContext('canvasProgress')
    let query = wx.createSelectorQuery();
    query.select('#progress-bg').boundingClientRect((rect) => {
      that.canvasProgressbg.setFillStyle('#D8D8D8');
      that.canvasProgressbg.fillRect(0, 0, rect.width, 50);
      that.canvasProgressbg.draw();

      that.canvasProgress.setFillStyle('#09BB07');
      that.canvasProgress.fillRect(0, 0, 0, 50);
      that.canvasProgress.draw();

      that.canvasProgressPoint.drawImage('/img/ic_progress_point.png', 0, 0, 12, 12)
      that.canvasProgressPoint.draw();
    }).exec()
  },

  /**
   * 设置进度条的进度
   * 
   * @param total 总进度
   * @param index 当前进度
   */
  setProgress: function(total, index) {
    // 绘制出初始进度
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#progress-bg').boundingClientRect(function(rect) {
      let i = ((rect.width - 12) / total) + (((rect.width - 12) / total) * index);
      // console.log(total, index, i)
      that.canvasProgressPoint.drawImage('../../img/ic_progress_point.png', i, 0, 12, 12);
      that.canvasProgressPoint.draw();

      that.canvasProgress.setFillStyle('#09BB07');
      that.canvasProgress.fillRect(0, 0, i, 50);
      that.canvasProgress.draw();

    }).exec();
  },

  // 初始化语音
  initVoice: function() {
    let that = this
    that.innerAudioContext.src = this.data.cardDetail.Voice
    // that.innerAudioContext.autoplay = true
    let interval = setInterval(function() {
      if (that.innerAudioContext.duration !== 0) {
        console.log('语音总时长' + that.sec_to_time(that.innerAudioContext.duration))
        that.setData({
          duration: that.sec_to_time(that.innerAudioContext.duration)
        });
        clearInterval(interval);
      }
    }, 100)
    that.innerAudioContext.onPlay(() => {
      console.log('开始播放');
    });
    that.innerAudioContext.onPause(() => {
      console.log('暂停播放')
      that.setData({
        voiceIntroIcon: '/img/img_voice_play_00.png'
      });
    })
    that.innerAudioContext.onStop(() => {
      console.log('停止播放');
      that.setData({
        voiceIntroIcon: '/img/img_voice_play_00.png'
      });
    });
    that.innerAudioContext.onEnded(() => {
      console.log('播放完毕');
      clearInterval(that.audioTimerId)
      clearInterval(that.audioIconId)
      that.initProgress();
      this.setData({
        currentTime: '00:00',
        voiceIntroIcon: '/img/img_voice_play_00.png'
      });
      isClick = true
    });
    that.innerAudioContext.onError((res) => {
      console.log(res.errMsg);
      console.log(res.errCode);
    });
  },

  /**
   * 播放与暂停
   */
  onPlayStop() {
    let that = this
    if (isClick) {
      isClick = false
      if (that.innerAudioContext.paused) {
        that.innerAudioContext.play()
        that.audioTimerId = setInterval(function() {
          that.setData({
            currentTime: that.sec_to_time(that.innerAudioContext.currentTime)
          });
          that.setProgress(that.innerAudioContext.duration, that.innerAudioContext.currentTime);
        }, 100);

        let i = 0;
        that.audioIconId = setInterval(function() {
          that.setData({
            voiceIntroIcon: '../../img/img_voice_play_0' + i + '.png'
          });
          i += 1;
          if (i == 3) {
            i = 0;
          }
        }, 500);
      }
    } else {
      that.innerAudioContext.pause();
      clearInterval(that.audioTimerId)
      clearInterval(that.audioIconId)
      isClick = true
    }

    console.log(that.innerAudioContext.paused)
  },

  /**
   * 获取名片详情
   */
  getCardDetail() {
    let that = this
    return new Promise((resolve, resject) => {
      wx.showLoading({
        title: '正在加载中',
        mask: true
      })
      console.log(app.globalData)
      wx.request({
        url: app.globalData.url + 'Card/Detail',
        method: 'get',
        data: {
          CardID: CardID,
          UserID: app.globalData.userInfo.UserID
        },
        success(res) {
          if (res.data.State == 'Success') {
            that.setData({
              cardDetail: res.data.Result
            })
            resolve(res.data.Result)
          }
        }
      })
    })
  },

  /**
   * 时间秒数格式化
   * @param s 时间戳（单位：秒）
   * @returns {*} 格式化后的分秒
   */
  sec_to_time: function(s) {
    let t;
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = parseInt(s % 60);
      if (min < 10) {
        t = "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
  },

  /**
   * 手机呼叫
   */
  tapPhoneCall: function(event) {
    console.log(event)
    let that = this
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone,
      success(res) {
        if (res.errMsg == 'makePhoneCall:ok') {
          app.userLog(that.data.cardDetail.CardID, event.currentTarget.dataset.phoneid || 84)
        }
      }
    });
  },

  tapContentCopy: function(event, id) {
    console.log(event)
    wx.setClipboardData({
      data: event.currentTarget.dataset.copy,
      success(res) {
        if (res.errMsg == 'setClipboardData:ok') {
          app.userLog(app.globalData.CardID, id)
        }
      }
    });
  },

  /**
   * 复制邮箱
   */
  onContentCopyEmail(event) {
    this.tapContentCopy(event, 81)
  },

  /**
   * 复制公司
   */
  onContentCopyFirmName(event) {
    this.tapContentCopy(event, 81)
  },

  /**
   * 复制微信号
   */
  onContentCopyWeChat(event) {
    this.tapContentCopy(event, 50)
  },

  /**
   * 打开地图
   */
  tapMapNavigation: function(event) {
    let that = this
    wx.openLocation({
      latitude: that.data.cardDetail.Lat,
      longitude: that.data.cardDetail.Lng,
      scale: 18,
      name: '财富广场',
      address: event.currentTarget.dataset.address
    })
  },

  /**
   * 存入手机通讯录
   */
  tapAddPhoneContact: function() {
    wx.addPhoneContact({
      firstName: this.data.cardDetail.Name,
      mobilePhoneNumber: this.data.cardDetail.Mobile,
      weChatNumber: this.data.cardDetail.WeChatCode,
      organization: this.data.cardDetail.EnterpriseName,
      title: this.data.cardDetail.Position,
      hostNumber: this.data.cardDetail.Phone,
      email: this.data.cardDetail.Email,
      workAddressStreet: this.data.cardDetail.Address,
    });
  },

  /**
   * 咨询
   */
  openChatPage: function() {
    wx.navigateTo({
      url: '/pages/chat/chat'
    });
  },

  /**
   * 返回列表页
   */
  openCardListPage: function() {
    wx.reLaunch({
      url: '/pages/cardlist/cardlist'
    });
  },

  openVideoPage: function(e) {
    wx.navigateTo({
      url: '/pages/video/video?src=' + e.currentTarget.dataset.src + '&thumbnail=' + e.currentTarget.dataset.thumbnail
    });
  },

  add: function(e) {
    const {
      cardDetail
    } = this.data;
    console.log(cardDetail.CardTabs)
    if (cardDetail.CardTabs[e.currentTarget.dataset.index].HadLike) {
      return
    }
    cardDetail.CardTabs[e.currentTarget.dataset.index].HadLike = true
    cardDetail.CardTabs[e.currentTarget.dataset.index].Count = parseInt(cardDetail.CardTabs[e.currentTarget.dataset.index].Count) + 1
    this.setData({
      // num: num + 1,
      move: 'move',
      tabId: e.currentTarget.dataset.id,
      cardDetail: cardDetail
    });
    setTimeout(() => {
      this.setData({
        move: ''
      });
    }, 1000);
    app.userLog(cardDetail.CardTabs[e.currentTarget.dataset.index].TabID, 90)

  },

  toggleReliable: function() {
    this.setData({
      reliableStatus: this.data.reliableStatus ===
        '/img/ic_home_like_nor.png' ?
        '/img/ic_home_like_pre.png' : '/img/ic_home_like_nor.png',
    });
  },

  /**
   * 生成海报按钮出发的 tap 事件
   */
  generateposter: function() {
    wx.hideTabBar()
    // var that = this
    // var ctx = wx.createCanvasContext('mycanvas')
    // ctx.setFillStyle('#fff')
    // ctx.fillRect(0, 0, 311, 500)
    // ctx.fill()
    // ctx.beginPath()

    // ctx.drawImage('/img/img03.png', 16, 16, 279, 279)
    // ctx.beginPath()

    // ctx.setFontSize(24)
    // ctx.setFillStyle('#2C364C')
    // ctx.fillText(that.data.cardDetail.Name, 20, 338)
    // ctx.beginPath()

    // ctx.setFontSize(16)
    // ctx.setFillStyle('#2C364C')
    // ctx.fillText(that.data.cardDetail.Position, 100, 338)
    // ctx.beginPath()

    // ctx.setFontSize(12)
    // ctx.setFillStyle('#8B9199')
    // ctx.fillText('既然选择了远方，便只顾风雨兼程', 20, 358)
    // ctx.beginPath()

    // ctx.drawImage('/img/logo.png', 24, 380, 32, 32)
    // ctx.beginPath()

    // ctx.setFontSize(12)
    // ctx.setFillStyle('#8B9199')
    // ctx.fillText(that.data.cardDetail.EnterpriseName, 20, 427)
    // ctx.beginPath()

    // ctx.drawImage('/img/img_bg_repdkd.png', 5, 292, 306, 209)
    // ctx.beginPath()

    // ctx.save()
    // ctx.beginPath()
    // ctx.arc(263, 453, 40, 0, Math.PI * 2, false);
    // ctx.clip();
    // ctx.drawImage('/img/img02.png', 223, 413, 80, 80)
    // ctx.restore();

    // ctx.draw(false, function() {
    //   wx.canvasToTempFilePath({
    //     // x: 0,
    //     // y: 0,
    //     // width: 311,
    //     // height: 500,
    //     // destWidth: 311,
    //     // destHeight: 500,
    //     canvasId: 'mycanvas',
    //     success(res) {
    //       that.setData({
    //         src: res.tempFilePath
    //       })
    //       console.log(res.tempFilePath)
    //     }
    //   })
    // })
    this.setData({
      openMask: true
    })
  },

  /**
   * 保存海报
   */
  poster() {
    console.log(12345)
    var that = this
    wx.getImageInfo({
      src: that.data.cardDetail.Poster,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            wx.showModal({
              title: '保存海报成功',
              content: '名片海报已保存到手机相册,你可以分享到朋友圈了',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.setData({
                    openMask: false
                  })
                  wx.showTabBar()
                }
              }
            })
          }
        })
      }
    })
    console.log(that.data.cardDetail.Poster)
  },

  /**
   * 关闭海报
   */
  onClosePoster() {
    this.setData({
      openMask: false
    })
    wx.showTabBar()
    console.log()
  },

  /**
   * 点击靠谱
   */
  onCollection() {
    let {
      cardDetail
    } = this.data
    cardDetail.HadLike = !cardDetail.HadLike
    cardDetail.HadLike ? ++cardDetail.LikeCount : --cardDetail.LikeCount
    app.userLog(cardDetail.CardID, 63)
    this.setData({
      cardDetail: cardDetail
    })
  },

  /**
   * 生产海报接口
   */
  getPoster() {
    let that = this
    wx.request({
      url: app.globalData.url + 'Card/GetPoster',
      method: 'get',
      data: {
        cardID: 5
      },
      success(res) {
        if (res.data.State == 'Success') {
          that.setData({
            Posterpath: res.data.Result.Posterpath
          })
        }
        console.log(res)
      }
    })
  },

  // 签名用户
  tsImSign() {
    wx.request({
      url: app.globalData.url + 'ChatIm/GetFromAndToByCardID',
      method: 'GET',
      data: {
        FromUserID: app.globalData.userInfo.UserID,
        CardID: app.globalData.CardID,
        Source: app.globalData.Source||0
      },
      success(res) {
        if (res.data.State == 'Success') {
          app.globalData.from = res.data.Result.From,
            app.globalData.to = res.data.Result.To
        }
        console.log(res)
      }
    })
  },

  // 跳转到ai雷达
  onNavAiradar() {
    wx.redirectTo({
      url: '/pages/airadar/airadar',
    })
  }
})