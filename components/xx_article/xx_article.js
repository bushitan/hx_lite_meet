
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        mode: {
            type: String,
            value: "normal",
            // observer: '_changeStyle',
        },
        content: {
            type: Object,
            value: {},
            // observer: '_changeList',
        },
  },

  /**
   * 组件的初始数据
   */
    data: {
        MODE_NORMAL: "normal",
        MODE_TEXT: "text",
        MODE_AUDIO: "audio",
        MODE_VIDEO: "video",
        // MODE_LIVE : "news",
    },
    ready(){
        console.log("article ready")
    },
  /**
   * 组件的方法列表
   */
  methods: {

      // 改变等级
    //   _changeStyle(newVal, oldVal) {
    //         // console.log(1111,newVal, oldVal)
    //         // this.setData({
    //         //     style: newVal
    //         // })
    //   },
      click(e) {     
          this.triggerEvent('click', e.currentTarget.dataset.index);
      },
  }
})
