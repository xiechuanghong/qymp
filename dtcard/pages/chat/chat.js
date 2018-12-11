// pages/chat/chat.js
const {
  emojis,
  emojiToPath,
  textToEmoji
} = require('../../utils/emojis');
const app = getApp()
const base = require('../../utils/wx_im/base64.js')
const json2 = require('../../utils/wx_im/json2.js')
const webim = require('../../utils/wx_im/webim_wx.js')
const get_history_msg = require('../../utils/wx_im/get_history_msg.js')
const show_one_msg = require('../../utils/wx_im/show_one_msg.js')
const moment = require('../../utils/moment.min.js')
// let to, from
var selType = webim.SESSION_TYPE.C2C;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showChatInputMore: false,
    showChatInputEmoji: false,
    showSendButton: false,
    chatInputValue: '',
    chatInputFocus: false,

    emojiList: [],
    showEmojis: true,
    showFiles: true,

    messages: [],
    lastViewId: '',

    showCamera: false,
    camera: false,
    showPhoto: false,
    src: '/img/img03.png',

    devicePosition: 'back',

    IsComplete: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取表情包
    const emojiList = Object.keys(emojis).map(key => ({
      key: key,
      img: emojiToPath(key)
    }));
    // scroll-view 最底部的ID
    let lastViewId = 'msg' + (this.data.messages.length - 1);

    // TODO
    let messages = this.data.messages;
    for (let i = 0; i < messages.length; i++) {
      messages[i].time = this.getTime();
    }

    // 更新状态
    this.setData({
      messages,
      emojiList,
      lastViewId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let obj = {
      navigation: true,
      id: "msg0",
      message: '你好，欢迎进入我的名片，你有什么需求可以在这里跟我实时沟通，谢谢！',
      messageType: 'navigation',
      avatar: app.globalData.to.Avatar || '',
      time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    }
    let that = this,
      newMsgArr = [];
    wx.showLoading({
      title: '正在加载历史记录',
      mask: true
    })
    this.testLoginWebIm().then(() => {
      that.getC2CHistoryMsgs({
        toUserID: app.globalData.to.UserName,
        complete: function(res) {
          //反转数组
          var msgList = res.MsgList;
          console.log(msgList)
          for (var j in msgList) { //遍历新消息
            var msg = msgList[j];
            if (msg.getSession().id() == app.globalData.to.UserName) { //为当前聊天对象的消息
              var user = msg.isSend ? app.globalData.from : app.globalData.to;
              console.log(user)
              let onemsg = show_one_msg.convertMsgtoHtml(msg, user);
              onemsg[0].time = moment(onemsg[0].time).format('YYYY-MM-DD HH:mm:ss')
              newMsgArr.push(...onemsg)
            }
          }
          let messages = that.data.messages
          newMsgArr.push(obj)
          messages.push(...newMsgArr)
          let lastViewId = 'msg' + (messages[messages.length - 1].id);
          that.setData({
            messages,
            lastViewId,
            msgKey: res.MsgKey,
            LastMsgTime: res.LastMsgTime,
            IsComplete: res.IsComplete
          }, () => {
            wx.hideLoading()
          })
          console.log(newMsgArr)
        },
        noComplete() {
          let messages = that.data.messages
          messages.push(obj)
          that.setData({
            messages
          }, () => {
            wx.hideLoading()
          })
        }
      })
    })
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
    console.log('页面隐藏了')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('页面卸载了')
    webim.logout((res) => {
      if (res.ActionStatus == 'OK') {
        console.log('退出聊天成功')
      }
    })
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

  hideAll: function() {
    if (this.data.showChatInputMore) {
      this.setData({
        showChatInputMore: !this.data.showChatInputMore
      });
    }
    if (this.data.showChatInputEmoji) {
      this.setData({
        showChatInputEmoji: !this.data.showChatInputEmoji
      });
    }
  },

  // 发送表情
  tapEmojiShowOrHide: function() {
    return
    this.setData({
      showChatInputEmoji: !this.data.showChatInputEmoji
    });
    if (this.data.showChatInputMore) {
      this.setData({
        showChatInputMore: !this.data.showChatInputMore
      });
    }
  },

  // 发送图片
  tapMoreShowOrHide: function() {
    return
    this.setData({
      showChatInputMore: !this.data.showChatInputMore
    });
    if (this.data.showChatInputEmoji) {
      this.setData({
        showChatInputEmoji: !this.data.showChatInputEmoji
      });
    }
  },

  // 获取input值
  input_ChatInput: function(event) {
    this.setData({
      chatInputValue: event.detail.value,
    });
  },

  // 发送消息
  sendMessage: function() {
    if (this.data.chatInputValue == '') {
      return
    }
    let that = this;
    let messages = this.data.messages;
    // console.log(app.globalData,to)
    this.onSendMsg(app.globalData.to, selType, that.data.chatInputValue, {
      success: function(msg) {
        let obj = {
          text: that.data.chatInputValue,
          image: '',
          avatar: app.globalData.userInfo.Avatar,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          nike: app.globalData.userInfo.NickName,
          type: 'TIMTextElem',
          isSend: true,
          id: msg.random
        }
        messages.push(obj)
        let lastViewId = 'msg' + (messages[messages.length - 1].id);
        that.setData({
          messages,
          chatInputValue: '',
          lastViewId
        })
        console.log(msg)
      },
      error: function(error) {
        console.log(error);
      }
    })


  },

  // 点击表情
  clickEmoji: function(e) {
    const {
      key
    } = e.currentTarget.dataset;
    const {
      chatInputValue
    } = this.data;
    this.setData({
      chatInputValue: chatInputValue + key
    });
  },

  delEmoji: function(e) {
    let chatInputValue = this.data.chatInputValue;
    this.setData({
      chatInputValue: chatInputValue.slice(0, chatInputValue.length - 1)
    });
  },

  chooseImage: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(res);
      }
    })
  },

  openCamera: function() {
    // wx.navigateTo({ url: '/pages/camera/camera' });
    this.setData({
      showCamera: true,
      camera: true
    });
  },

  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res);
        this.setData({
          src: res.tempImagePath,
          showPhoto: true,
          camera: false,
        });
      }
    })
  },

  error(e) {
    console.log(e.detail)
  },

  changeDevicePosition: function() {
    this.setData({
      devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
    });
  },

  closeCamera: function() {
    this.setData({
      showCamera: false,
    })
  },

  getTime: function() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let t = date.getFullYear();

    if (month < 10) {
      t += '/0' + month;
    } else {
      t += '/' + month;
    }

    if (day < 10) {
      t += '/0' + day;
    } else {
      t += '/' + day;
    }

    if (hours < 10) {
      t += ' 0' + hours;
    } else {
      t += ' ' + hours;
    }

    if (minutes < 10) {
      t += ':0' + minutes;
    } else {
      t += ':' + minutes;
    }

    return t;
  },

  // 初始化聊天
  testLoginWebIm() {
    return new Promise((resolve, reject) => {
      console.log(app.globalData)
      let obj = {
        data: {
          Config: {
            accountMode: 0,
            accountType: 36862,
            sdkappid: 1400157072,
          },
          userInfo: app.globalData.from,
          //监听事件（1V1监听这两个事件就够了）
          listeners: {
            "onConnNotify": this.onConnNotify, //监听连接状态回调变化事件,必填
            "onMsgNotify": this.onMsgNotify
          },
        }
      };
      // 登陆
      this.sdkLogin(this, obj, {
        success: function() {
          resolve()
        },
        error: function() {
          console.log();
        }
      });
    })
  },
  // 登陆监听
  onConnNotify(resp) {
    switch (resp.ErrorCode) {
      case webim.CONNECTION_STATUS.ON:
        //webim.Log.warn('连接状态正常...');
        console.log('登陆成功')
        break;
      case webim.CONNECTION_STATUS.OFF:
        console.log('连接断开')
        webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
        break;
      default:
        webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
        break;
    }
  },
  // 聊天监听
  onMsgNotify(newMsgList) {
    let that = this
    //console.warn(newMsgList);
    let sess, newMsg, selSess
    //获取所有聊天会话
    var sessMap = webim.MsgStore.sessMap();

    for (var j in newMsgList) { //遍历新消息
      newMsg = newMsgList[j];
      if (newMsg.getSession().id() == app.globalData.to.UserName) { //为当前聊天对象的消息
        selSess = newMsg.getSession();
        //在聊天窗体中新增一条消息
        //console.warn(newMsg);
        // var onemsg = show_one_msg.addMsg(newMsg, to);
        let model = show_one_msg.convertMsgtoHtml(newMsg, app.globalData.to)
        model[0].time = moment(model[0].time).format('YYYY-MM-DD HH:mm:ss')
        that.data.messages.push(...model)
        that.setData({
          messages: that.data.messages,
        },()=>{
          if (that.data.isBtn) {
            let lastViewId = 'msg' + (that.data.messages[that.data.messages.length - 1].id);
            that.setData({ lastViewId })
          }
        })
        var res = moment(newMsg.sess._impl.time * 1000).format('YYYY-MM-DD HH:mm:ss');
        // $message.append(onemsg);
      }
    }
    //消息已读上报，以及设置会话自动已读标记
    webim.setAutoRead(selSess, true, true);
    //for (var i in sessMap) {
    //    sess = sessMap[i];
    //    if (to.name != sess.id()) {//更新其他聊天对象的未读消息数
    //        updateSessDiv(sess.type(), sess.id(), sess.unread());
    //    }
    //}
  },
  // 聊天登陆
  sdkLogin(that, app, callback) {
    if (!callback) {
      callback = () => {

      }
      callback.success = function() {};
      callback.error = function() {}
    }
    if (!callback.success) {
      callback.success = function() {};
    }
    if (!callback.error) {
      callback.error = function() {}
    }
    //当前用户身份
    var loginInfo = {
      'sdkAppID': app.data.Config.sdkappid, //用户所属应用id,必填
      'appIDAt3rd': app.data.Config.sdkappid, //用户所属应用id，必填
      'accountType': app.data.Config.accountType, //用户所属应用帐号类型，必填
      'identifier': app.data.userInfo.UserName, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': app.data.userInfo.NickName, //当前用户昵称，选填
      'userSig': app.data.userInfo.Sign, //当前用户身份凭证，必须是字符串类型，选填
    };
    //监听事件（1V1监听这两个事件就够了）
    var listeners = {
      "onConnNotify": app.data.listeners.onConnNotify, //监听连接状态回调变化事件,必填
      "onMsgNotify": app.data.listeners.onMsgNotify
    };
    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true, //是否访问正式环境，默认访问正式，选填
      'isLogOn': true //是否开启控制台打印日志,默认开启，选填
    };
    //sdk登录(独立模式)
    webim.login(loginInfo, listeners, options, function(resp) {
      callback.success();
    }, function(err) {
      callback.error(err);
    });
  },
  // 发消息到腾讯云
  onSendMsg(to, selType, msg, option) {
    if (!option) {
      option.success = function() {};
      option.error = function() {};
    } else if (!option.success) {
      option.success = function() {};
    } else if (!option.error) {
      option.error = function() {};
    }
    //获取消息内容
    var msgtosend = msg;
    var msgLen = webim.Tool.getStrBytes(msg);
    // 创建会话对象
    console.log(app.globalData)
    var selSess = new webim.Session(selType, to.UserName, to.NickName, to.Avatar, Math.round(new Date().getTime() / 1000));
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType = webim.C2C_MSG_SUB_TYPE.COMMON; //消息子类型c2c消息时，参考c2c消息子类型对象：webim.C2C_MSG_SUB_TYPE 
    //loginInfo.identifier消息发送者账号,loginInfo.identifierNick消息发送者昵称
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, to.UserName, subType, to.NickName);
    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgtosend.match(expr);
    if (!emotions || emotions.length < 1) {
      var text_obj = new webim.Msg.Elem.Text(msgtosend);
      msg.addText(text_obj);
    } else { //有表情

    }
    webim.sendMsg(msg, function(resp) {
      if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息
        option.success(msg);
      }
    }, function(err) {
      //重发
      showReSend(msg);
      option.error(err);
      //webim.Log.error("发消息失败:" + err.ErrorInfo);
    });
  },
  // 获取历史记录
  getC2CHistoryMsgs(option) {
    console.log(option)
    if (!option.complete) {
      option.complete = function() {};
    }
    if (!option.error) {
      option.error = function() {};
    }
    if (!option.adding) {
      option.adding = function() {};
    }
    if (!option.toUserID) {
      throw "toUserID不能为空";
    }
    if (!option.reqMsgCount) {
      option.reqMsgCount = 10;
    }
    if (!option.lastMsgTime) {
      option.lastMsgTime = 0;
    }
    if (!option.msgKey) {
      option.msgKey = "";
    }
    if (!option.noComplete) {
      option.noComplete = function() {};
    }

    if (selType == webim.SESSION_TYPE.GROUP) {
      alert('当前的聊天类型为群聊天，不能进行拉取好友历史消息操作');
      return;
    }

    //第一次拉取好友历史消息时，必须传0
    //var msgKey = wx.getStorageSync('msgKey') || '';
    var reqMsgCount = 5;
    var options = {
      'Peer_Account': option.toUserID, //好友帐号
      'MaxCnt': option.reqMsgCount, //拉取消息条数
      'LastMsgTime': option.lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
      'MsgKey': option.msgKey //消息的ID第一次取时候传空
    };
    //selSess = null;
    webim.MsgStore.delSessByTypeId(selType, option.toUserID);
    webim.getC2CHistoryMsgs(
      options,
      function(resp) {
        var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有

        if (resp.MsgList.length == 0) {
          option.noComplete();
          return
        }
        //拉取消息后，要将下一次拉取信息所需要的东西给存在缓存中
        //wx.setStorageSync('lastMsgTime', resp.LastMsgTime);
        //wx.setStorageSync('msgKey', resp.MsgKey);
        option.complete({
          MsgKey: resp.MsgKey,
          LastMsgTime: resp.LastMsgTime,
          IsComplete: resp.Complete == 1,
          MsgList: resp.MsgList
        });
      }
    )
  },
  // 顶部事件
  onScrolltoupper(LastMsgTime, msgKey) {
    if (this.data.IsComplete) {
      return
    }
    wx.showLoading({
      title: '正在加载中',
      mask: true
    })
    let id = this.data.messages[0].id
    let that = this,
      newMsgArr = []
    console.log('到顶部了', this.data.messages,app.globalData)
    that.getC2CHistoryMsgs({
      toUserID: app.globalData.to.UserName,
      lastMsgTime: that.data.LastMsgTime,
      msgKey: that.data.msgKey,
      complete: function(res) {
        console.log(res.LastMsgTime, res.IsComplete)
        var msgList = res.MsgList;

        for (var j in msgList) { //遍历新消息
          var msg = msgList[j];
          if (msg.getSession().id() == app.globalData.to.UserName) { //为当前聊天对象的消息
            var user = msg.isSend ? app.globalData.from : app.globalData.to;
            let onemsg = show_one_msg.convertMsgtoHtml(msg, user);
            onemsg[0].time = moment(onemsg[0].time).format('YYYY-MM-DD HH:mm:ss')
            newMsgArr.push(...onemsg)
          }
        }
        let messages = that.data.messages
        messages.unshift(...newMsgArr)
        let lastViewId = 'msg' + id;

        that.setData({
          messages,
          lastViewId,
          msgKey: res.MsgKey,
          LastMsgTime: res.LastMsgTime,
          IsComplete: res.IsComplete
        }, () => {
          wx.hideLoading()
        })
        console.log(newMsgArr)
      }
    })
  },
  // 滚动事件
  onScroll(e) {
    let query = wx.createSelectorQuery();
    let that = this
    wx.getSystemInfo({
      success:   function(res)  {
        query.select('.chat-input-container').boundingClientRect((rect) => {
          let scrollTop = rect.height + e.detail.scrollHeight - e.detail.scrollTop
          that.setData({
            isBtn: scrollTop >= res.windowHeight && scrollTop - 100 < res.windowHeight
          })
          // console.log(scrollTop >= res.windowHeight && scrollTop-50 < res.windowHeight)
        }).exec()
      },
    })
  }

})