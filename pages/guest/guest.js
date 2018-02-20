// pages/together/together.js
// var KEY = require('../../utils/storage_key.js');
// var PRO_ARTICLE = require('../../pro/pro_article.js');
var API = require('../../utils/api.js');
var PRO_COVER = require('../../pro/pro_cover.js');
var xx_cover; //封面的公共方法 
var PRO_PAGE = require('../../pro/pro_page.js');
var APP = getApp()
var GP;
Page({
    data: {
    },

    toXXArticle() {
        var url = '../article_text/article_text?art_id=220'
        wx.navigateTo({
            url: url
        })
    },

    /**
     * index初始化
     * 加载默认的标签
     */
    onLoad: function (options) {

        GP = this
        xx_cover = new PRO_COVER.Cover(GP) //初始化 封面下拉列表

        //必须要登陆以后再做的事情
        if (APP.globalData.isLogin == true)
            GP.onInit(options)
        else
            APP.login(options)

    },

    /**
     * 选择新行业后返回，更新默认目录
     */
    onShow() {

        if (APP.globalData.isLogin == true) {  //已经登录

        }
    },

    //必须要登陆以后发起的请求，在这里完成
    onInit: function (options) {
        xx_cover.AddList(
            API.MEET_GUEST,
            { "meet_id": 1 },
        )
    },


    /**
      * 事件
      * 滚动到底部
      */
    scrollBottom() {
        if (PRO_ARTICLE.CheckScrollLock(GP)) //通过才能继续查
            GP.getArticleGetListByTag(GP.data.sonTagID)
    },

    onShareAppMessage: function () {
        return {
            title: '快讯',
            desc: '简讯、资讯信息',
            path: '/pages/index/index?father_tag_id=' + GP.data.fatherTag.tag_id
        }
    },


    /**
     * 点击滚动栏
     */
    bannerToArticle: function (e) {
        var article_id = e.currentTarget.dataset.article_id
        wx.setStorageSync("current_article_list", [])
        var url = '../detail/detail?art_id=' + article_id
        wx.navigateTo({
            url: url
        })

    },

})
