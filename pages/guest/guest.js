var API = require('../../utils/api.js');
var PRO_PAGE = require('../../pro/pro_page.js');

var ActionCover = require('../../action/cover.js');
var action_cover
var APP = getApp()
var GP;
Page({
    data: {
    },

    //页面onload
    onLoad: function (options) {
        GP = this
        action_cover = new ActionCover.ActionCover(GP)
        GP.updateArticleList()
    },

    //页面show
    onShow() {
        if (APP.globalData.isLogin == true) {  //已经登录
        }
    },

    onInit: function (options) {
        GP.updateArticleList()
    },

    //事件：滚动到底部
    scrollBottom() {
        GP.updateArticleList()
    },

    //更新内容
    updateArticleList(){
        action_cover.GetArticleList(
            API.MEET_GUEST,
            { "meet_id": 1 },
        )
    },

    //点击节点
    clickNode() {
        var url = '../article_text/article_text?art_id=220'
        wx.navigateTo({
            url: url
        })
    },

    onShareAppMessage: function () {
        return {
            title: '快讯',
            desc: '简讯、资讯信息',
            path: '/pages/index/index?father_tag_id=' + GP.data.fatherTag.tag_id
        }
    },
})
