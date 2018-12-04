// components/bubble /bubble.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: ''
    },
    message: {
      type: Array,
      value: ''
    },
    isSend: {
      type: Boolean,
      value: ''
    },
    contentType: {
      type: String,
      value: 'text'
    },
    image: {
      type: String,
      value: '',
    },
    time: {
      type: String,
      value: '',
    },
    text: {
      type: String,
      value: '',
    },
    navigation: {
      type: Boolean,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转到名片详情
    onNavigateToCardDetail() {
      wx.reLaunch({
        url: '/pages/carddetail/carddetail?CardID=' + app.globalData.CardID,
      })
    },
    // 跳转到公司官网
    onNavigateToWebsite() {
      wx.reLaunch({
        url: '/pages/website/website' ,
      })
    },
    // 查看我们公司商品
    onNavigateToShop() {
      wx.reLaunch({
        url: '/pages/shop/shop' ,
      })
    },
    // 查看我的动态
    onNavigateToDynamic() {
      wx.reLaunch({
        url: '/pages/dynamic/dynamic' ,
      })
    },
    // 拨打手机人联系电话
    onPhone(event) {
      let that = this
      wx.makePhoneCall({
        phoneNumber: event.currentTarget.dataset.phone,
        success(res) {
        }
      });
    }
  },
})