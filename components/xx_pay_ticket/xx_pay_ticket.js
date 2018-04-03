// components/xx_cover_news/xx_cover_news.js
var QR = require("js/qrcode.js");
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
        qr: { //二维码序列号
            type: String,
            value: "21321",
            observer:"changeQR"
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
      imagePath: '',    //二维码的临时路径
      imageWidth:240, //二维码宽度
  },

    ready(){
        this.addQR()
    },
  /**
   * 组件的方法列表
   */
  methods: {
      // 改变
    changeQR(newVal, oldVal) {
        if (newVal != "")
            this.addQR()
    },

    addQR() {
        var size = this.setCanvasSize();
        //绘制二维码
        this.createQrCode(this.data.qr, "mycanvas", size.w, size.h);
    },

    setCanvasSize: function () {
        var size = {};
        try {
            var res = wx.getSystemInfoSync();
            var scale = 750 / this.data.imageWidth;//不同屏幕下canvas的适配比例；设计稿是750宽
            var width = res.windowWidth / scale;
            var height = width;//canvas画布为正方形
            size.w = width;
            size.h = height;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败" + e);
        }
        return size;
    },
    createQrCode: function (url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(url, canvasId, cavW, cavH,this);
        this.canvasToTempImage(); 

    },
    //获取临时缓存照片路径，存入data中
    canvasToTempImage: function () {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
                var tempFilePath = res.tempFilePath;
                console.log(tempFilePath);
                that.setData({
                    imagePath: tempFilePath,
                    // canvasHidden:true
                });
            },
            fail: function (res) {
                console.log(res);
            }
        },this);
    },

  }
})
