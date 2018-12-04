// pages/test2/test2.js
const app = getApp()
const base = require('../../utils/wx_im/base64.js')
const json2 = require('../../utils/wx_im/json2.js')
const webim = require('../../utils/wx_im/webim_wx.js')
const get_history_msg = require('../../utils/wx_im/get_history_msg.js')
const show_one_msg = require('../../utils/wx_im/show_one_msg.js')
const moment = require('../../utils/moment.min.js')
var to = {
  userid: '84045542-350c-4ee4-97ba-a115d09dd260',
  name: 'wc201811120926143037',
  nick: 'hot pink',
  avatar: 'http://image.dtoao.com/201811120926147652.jpg',
  sign: null,
}
var selType = webim.SESSION_TYPE.C2C;
var from = {
  userid: '28941efb-9f01-499f-b749-b37f260e60d0	wc201810271534453072',
  name: 'wc201810271534453072',
  nick: 'sonicshadow',
  avatar: 'http://image.dtoao.com/201810271534453728.jpg',
  sign: 'eJxlj1FPgzAURt-5FYRXjbst7SomPiAjoZMZHCziXgijRaspEKg6Y-zvOlwi0ft6Tu6X82HZtu1kcXpWVlX70pjCvHfSsS9sB5zTX9h1ShSlKdxe-INy36leFmVtZD9CRCnFAFNHCdkYVauj8VZhQOcIMEPUJYS6wPDEHsRzMU7*vCMAiLI-inoY4SrcBHwRNtsqZzdZMFCRGyylbhY6SsqkSwN-S-tZullHIWnrua9CH1i*y-mVcJM8Wj2eLHV4K7g3W977dzHN0NPgB4xf610s*OVk0igtj30Eg0e8*bTwVfaDaptR*I6jCLtwOMf6tL4Ai5NdzQ__',
}


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.testLoginWebIm().then(() => {
      console.log('发送消息')
      this.onFromButton()
    })
    this.orderSign()
    this.onClick(e)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log(show_one_msg)
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
  orderSign(e) {
    this.getToken().then((res) => {
      console.log(res)
    })
  },

  getToken() {
    return new Promise((resolve, reject) => {
      let se = 'b186bd1fe13e8a2fd1d2c66893941462'
      let appid = 'wx4f0894f87f291778'
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + se + '',
        method: "post",
        success(res) {
          resolve(res)
          app.globalData.token = res.data.access_token
        }
      })
    })
  },

  // onClick(e) {
  //   let fId = e.detail.formId;
  //   console.log(fId)
  //   wx.request({
  //     url: app.globalData.url + 'ChatIm/SendMessage',
  //     method: 'post',
  //     data: {
  //       // content : 'asdasdasd',
  //       fromUserID: '27430e3f-bf06-43c5-b2d9-5d9f6171e1a0',
  //       formID: fId,
  //       toUserID: '38cd3c85-79ab-400d-aec5-760142fb0fec'
  //     },
  //     success(res) {
  //       console.log(res)
  //     }
  //   })
  // },

  onClick(e) {
    let that = this;
    let fId = e.detail.formId;
    wx.showModal({
      title: '提示',
      content: fId,
    })
    console.log(fId)
    let openid = "oxysv5TpRyrNFkCs3mgW_cWFl4fw"
    // let openid = "oxysv5bbevsMNp914mwU48CUwejM"
    console.log(fId)
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + app.globalData.token,
      method: 'post',
      data: {
        touser: openid,
        template_id: 'szJbdS4HgheYYCoDRy4sWwGZltbdSWYARzK5VYrzh1c',
        form_id: 'cbd5303fd180d3335428df25c0e80d78'
      },
      success(res) {
        console.log(res)
      }
    })
  },






  testLoginWebIm() {
    return new Promise((resolve, reject) => {
      var app = {
        data: {
          Config: {
            accountMode: 0,
            accountType: 36862,
            sdkappid: 1400157072,
          },
          userInfo: from,
          //监听事件（1V1监听这两个事件就够了）
          listeners: {
            "onConnNotify": this.onConnNotify, //监听连接状态回调变化事件,必填
            "onMsgNotify": this.onMsgNotify
          },
        }
      };
      // 登陆
      this.sdkLogin(this, app, {
        success: function() {
          resolve()
          //加载第一页的聊天记录
          // getC2CHistoryMsgs({
          //   toUserID: to.name,
          //   complete: function(res) {
          //     //反转数组
          //     var msgList = res.MsgList.reverse();

          //     for (var j in msgList) { //遍历新消息
          //       var msg = msgList[j];
          //       if (msg.getSession().id() == to.name) { //为当前聊天对象的消息
          //         var user = msg.isSend ? from : to;
          //         var onemsg = addMsg(msg, user);

          //         if ($message.children().length > 0) {
          //           $($message.children()[0]).before(onemsg);
          //         } else {
          //           $message.append(onemsg);
          //         }
          //       }
          //     }

          //     $message.scrollTop($message.prop("scrollHeight"));
          //     //如果还有历史记录
          //     if (!res.IsComplete) {
          //       var lastMsgTime = res.LastMsgTime;
          //       var msgKey = res.MsgKey;

          //       //滚动到顶部就加载历史记录
          //       $message.scroll(function() {
          //         //滚动到顶部就加载历史记录
          //         if ($message.scrollTop() == 0) {
          //           var height = 0;
          //           getC2CHistoryMsgs({
          //             toUserID: to.name,
          //             lastMsgTime: lastMsgTime,
          //             msgKey: msgKey,
          //             complete: function(res) {
          //               var $top = $($message.children()[0]);
          //               //反转数组
          //               var msgList = res.MsgList.reverse();
          //               for (var j in msgList) { //遍历新消息
          //                 var msg = msgList[j];
          //                 if (msg.getSession().id() == to.name) { //为当前聊天对象的消息
          //                   var user = msg.isSend ? from : to;
          //                   var onemsg = addMsg(msg, user);
          //                   $top.before(onemsg);
          //                   height += $(onemsg).height();
          //                   //console.log($top.offset().top);
          //                 }
          //               }
          //               //debugger;
          //               //console.log($message.height()+$message.sr );
          //               //$message.scrollTop($top.offset().top);
          //               //更新lastMsgTime和msgKey
          //               $message.scrollTop(height);
          //               lastMsgTime = res.LastMsgTime;
          //               msgKey = res.MsgKey;
          //               if (res.IsComplete) {
          //                 //如果已经加载完就注销滚动事件
          //                 $message.unbind("scroll");
          //               }
          //             }
          //           })
          //         }
          //       });
          //     }
          //   }
          // });
          //注册发送按钮
          // $("#btnSend").click(function(e) {
          //   //发消息
          //   onSendMsg(to, selType, $content.val(), {
          //     success: function(msg) {
          //       var onemsg = addMsg(msg, app.data.userInfo);
          //       $message.append(onemsg);
          //       $content.val("");
          //       $message.scrollTop($message.prop("scrollHeight"));
          //     },
          //     error: function(error) {
          //       console.log(error);
          //     }
          //   })
          // });
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
    //console.warn(newMsgList);
    let sess, newMsg, selSess
    //获取所有聊天会话
    var sessMap = webim.MsgStore.sessMap();
    for (var j in newMsgList) { //遍历新消息
      newMsg = newMsgList[j];
      if (newMsg.getSession().id() == to.name) { //为当前聊天对象的消息
        selSess = newMsg.getSession();
        //在聊天窗体中新增一条消息
        //console.warn(newMsg);
        // var onemsg = show_one_msg.addMsg(newMsg, to);
        console.log(newMsg)
        var res = moment(newMsg.sess._impl.time * 1000).format('YYYY-MM-DD HH:mm:ss');
        console.log(res)
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
  onFromButton() {
    console.log('发送消息')
    //发消息
    this.onSendMsg(to, selType, 'asdasdasd', {
      success: function(msg) {
        console.log(msg)
      },
      error: function(error) {
        console.log(error);
      }
    })
  },
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
    //this.init({
    //    accountMode: app.data.Config.accountMode
    //    , accountType: app.data.Config.accountType
    //    , sdkAppID: app.data.Config.sdkappid
    //    , selType: webim.SESSION_TYPE.C2C//私聊
    //    , agent_member_id: app.data.userInfo.id
    //    , id: selToID
    //    , name: app.data.userInfo.agent_name
    //    , icon: app.data.userInfo.agent_pic,
    //    that: that
    //});

    //当前用户身份
    var loginInfo = {
      'sdkAppID': app.data.Config.sdkappid, //用户所属应用id,必填
      'appIDAt3rd': app.data.Config.sdkappid, //用户所属应用id，必填
      'accountType': app.data.Config.accountType, //用户所属应用帐号类型，必填
      'identifier': app.data.userInfo.name, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': app.data.userInfo.nick, //当前用户昵称，选填
      'userSig': app.data.userInfo.sign, //当前用户身份凭证，必须是字符串类型，选填
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
    var selSess = new webim.Session(selType, to.name, to.nick, to.avatar, Math.round(new Date().getTime() / 1000));
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType = webim.C2C_MSG_SUB_TYPE.COMMON; //消息子类型c2c消息时，参考c2c消息子类型对象：webim.C2C_MSG_SUB_TYPE 
    //loginInfo.identifier消息发送者账号,loginInfo.identifierNick消息发送者昵称
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, to.name, subType, to.nick);
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
  }

})