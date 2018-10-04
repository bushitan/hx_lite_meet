// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var PRO_ARTICLE = require('../../pro/pro_article.js');
var PRO_COVER = require('../../pro/pro_cover.js');
var xx_cover; //封面的公共方法 
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
Page({
    data:{    
        isMore:true,
    }, 

    toXXArticle(e) {
        var index = e.detail  //索引
        var article_id = GP.data.articleList[index].article_id
        wx.navigateTo({
            url: '../article/article?article_id=' + article_id,
        })
    },

    /**
     * index初始化
     * 加载默认的标签
     */
    onLoad:function(options){

        GP = this
        GP.onInit()
    },

    /**
     * 选择新行业后返回，更新默认目录
     */
    onShow() {
        if (GP.data.meetID != wx.getStorageSync(API.KEY_MEET_ID)) {
            GP.onInit()
        }
    }, 

    //必须要登陆以后发起的请求，在这里完成
    onInit: function (){
        GP.setData({
            meetID: wx.getStorageSync(API.KEY_MEET_ID)
        })
        API.Request({
            'url': API.MEET_NEWS,
            'data': { "meet_id": GP.data.meetID },
            'success': function (res) {
                GP.setData({
                    newsSwiperList: res.data.news_swiper_list,
                    articleList: res.data.article_list,
                    isMore:false,
                })
            },
        })

    },

    onShareAppMessage: function () {
        return APP.share
    },

})
