// components/xx_cover_news/xx_cover_news.js
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        icon: {
            type: String,
            value: "../../images/mine_fill.png",
        },
        title: {
            type: String,
            value: "行业VIP会议",
        },
        status: {
            type: String,
            value: "已付款",
        },
        qr: {
            type: String,
            value: "../../images/meet_qr.jpg",
        },
        name: {
            type: String,
            value: "入场券",
        },
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
      // 改变
    _change(newVal, oldVal) {
    },

  }
})
