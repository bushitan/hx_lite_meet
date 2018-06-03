// pages/article_video/article_video.js

var GP
var APP = getApp()

var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        
        GP = this
        console.log(options)
        var article_id = options.article_id
        GP.getArticleContent(article_id)
    },


    //获取文章内容
    getArticleContent: function (article_id) {
        
        API.Request
        ({
            url: API.MEET_ARTICLE,
            data: {
                article_id: article_id,
            },
            success: function (res) {
                var object = res.data
                console.log(res.data)
                var _article_dict = object.article_dict
                //todo  判断style ，传入选择模板名称传入

                GP.setMode(_article_dict.style)
                GP.setData({
                    article: _article_dict
                })
            },
        })
        //   wx.request

    },

    setMode(style){

        var ARTICLE_STYLE_NORMAL = 1,
        ARTICLE_STYLE_TEXT = 2,
        ARTICLE_STYLE_AUDIO = 3,
        ARTICLE_STYLE_VIDEO = 4
        var _mode
        if (style == ARTICLE_STYLE_NORMAL)
            _mode = "normal"
        if (style == ARTICLE_STYLE_TEXT)
            _mode = "text"
        if (style == ARTICLE_STYLE_AUDIO)
            _mode = "audio"
        if (style == ARTICLE_STYLE_VIDEO)
            _mode = "video"
        GP.setData({
            mode: _mode
        })
    },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})